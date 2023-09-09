import Modal from "react-modal";
import React, { ReactElement, useState } from "react";
import { ResponseProposal } from "@/types";
import { VoteOption } from "@/pages/detail/[id]";
import { chainInfo } from "@/constant";
import { MsgVote } from "@keplr-wallet/proto-types/cosmos/gov/v1beta1/tx";
import { BroadcastMode, ChainInfo, Keplr, StdFee } from "@keplr-wallet/types";
import { Any } from "@keplr-wallet/proto-types/google/protobuf/any";
import {
  AuthInfo,
  Fee,
  SignerInfo,
  TxBody,
  TxRaw,
} from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import { SignMode } from "@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing";
import Long from "long";
import { PubKey } from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    background: "#1D1D1F",
    width: "400px",
    borderRadius: "12px",
  },
};

export const VoteModal = ({
  modalIsOpen,
  closeModal,
  proposal,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  proposal?: ResponseProposal;
}) => {
  const [voteOption, setVoteOption] = useState<VoteOption>("yes");
  const [review, setReview] = useState("");

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "500", fontSize: "18px", flex: 1 }}>Vote</div>
        <div
          style={{ fontWeight: "500", fontSize: "18px", cursor: "pointer" }}
          onClick={closeModal}
        >
          X
        </div>
      </div>

      <div
        style={{ marginTop: "24px", fontSize: "20px", marginBottom: "40px" }}
      >
        #{proposal?.proposal_id} {proposal?.content.title}
      </div>

      <div>
        <button
          style={{
            width: "100%",
            height: "44px",
            padding: "0 16px",
            border: "none",
            color: "#FEFEFE",
            borderRadius: "6px",
            background: voteOption === "yes" ? "#1D816F" : "#2E2E32",
            fontSize: "15px",
            textAlign: "left",
            marginBottom: "12px",
          }}
          onClick={() => setVoteOption("yes")}
        >
          Yes
        </button>
      </div>

      <div>
        <button
          style={{
            width: "100%",
            height: "44px",
            padding: "0 16px",
            border: "none",
            color: "#FEFEFE",
            borderRadius: "6px",
            background: voteOption === "no" ? "#1D816F" : "#2E2E32",
            fontSize: "15px",
            textAlign: "left",
            marginBottom: "12px",
          }}
          onClick={() => setVoteOption("no")}
        >
          No
        </button>
      </div>

      <div>
        <button
          style={{
            width: "100%",
            height: "44px",
            padding: "0 16px",
            border: "none",
            color: "#FEFEFE",
            borderRadius: "6px",
            background: voteOption === "no_with_veto" ? "#1D816F" : "#2E2E32",
            fontSize: "15px",
            textAlign: "left",
            marginBottom: "12px",
          }}
          onClick={() => setVoteOption("no_with_veto")}
        >
          No with Veto
        </button>
      </div>

      <div>
        <button
          style={{
            width: "100%",
            height: "44px",
            padding: "0 16px",
            border: "none",
            color: "#FEFEFE",
            borderRadius: "6px",
            background: voteOption === "abstain" ? "#1D816F" : "#2E2E32",
            fontSize: "15px",
            textAlign: "left",
            marginBottom: "12px",
          }}
          onClick={() => setVoteOption("abstain")}
        >
          Abstain
        </button>
      </div>

      <div style={{ margin: "12px 0" }}>Proposal Review</div>

      <div>
        <textarea
          rows={4}
          style={{ width: "100%", background: "#1D1D1F", color: "#F2F2F6" }}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
      </div>

      <div>
        <button
          style={{
            width: "100%",
            height: "44px",
            padding: "0 16px",
            border: "none",
            color: "#000",
            borderRadius: "6px",
            background: "#ECECF2",
            fontSize: "15px",
            marginTop: "12px",
          }}
          onClick={async () => {
            const key = await window.keplr?.getKey(chainInfo.chainId);
            const voter = key?.bech32Address || "";
            const proposalId = proposal?.proposal_id || "";

            const option = (() => {
              switch (voteOption) {
                case "yes":
                  return 1;
                case "no":
                  return 3;
                case "no_with_veto":
                  return 4;
                case "abstain":
                  return 2;
              }
            })();

            const protoMsg = {
              typeUrl: "/cosmos.gov.v1beta1.MsgVote",
              value: MsgVote.encode({
                proposalId,
                voter,
                option,
              }).finish(),
            };

            try {
              const gasUsed = await simulateMsg(
                chainInfo,
                voter,
                [protoMsg],
                [{ denom: "uosmo", amount: "236" }]
              );

              if (gasUsed && window.keplr) {
                await sendMsg(window.keplr, chainInfo, voter, [protoMsg], {
                  amount: [{ denom: "uosmo", amount: "236" }],
                  gas: Math.floor(gasUsed * 1.5).toString(),
                });
              }

              await fetch(
                `/api/write_review?chainId=${chainInfo.chainId}&proposalId=${proposalId}&address=${voter}&validatorAddress=${voter}&review=${review}&voteResult=${voteOption}`
              );
            } catch (e) {
              if (e instanceof Error) {
                console.log(e.message);
              }
            } finally {
              closeModal();
            }
          }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

const simulateMsg = async (
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: [
    {
      denom: string;
      amount: string;
    }
  ],
  memo: string = ""
) => {
  const accountResponse = await fetch(
    `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${sender}`
  );
  const account = (await accountResponse.json()).account;

  if (account) {
    const unsignedTx = TxRaw.encode({
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          SignerInfo.fromPartial({
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          }),
        ],
        fee: Fee.fromPartial({
          amount: fee.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
        }),
      }).finish(),
      // Because of the validation of tx itself, the signature must exist.
      // However, since they do not actually verify the signature, it is okay to use any value.
      signatures: [new Uint8Array(64)],
    }).finish();

    const simulatedResult = await fetch(
      `${chainInfo.rest}/cosmos/tx/v1beta1/simulate`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tx_bytes: Buffer.from(unsignedTx).toString("base64"),
        }),
      }
    );

    return (await simulatedResult.json()).gas_info.gas_used;
  }

  return undefined;
};

const sendMsg = async (
  keplr: Keplr,
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: StdFee,
  memo: string = ""
) => {
  const accountResponse = await fetch(
    `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${sender}`
  );
  const account = (await accountResponse.json()).account;

  const { pubKey } = await keplr.getKey(chainInfo.chainId);

  if (account) {
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: fee.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: fee.gas,
        }),
      }).finish(),
      chainId: chainInfo.chainId,
      accountNumber: Long.fromString(account.account_number),
    };

    const signed = await keplr.signDirect(chainInfo.chainId, sender, signDoc);

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    };

    await keplr.sendTx(chainInfo.chainId, signedTx.tx, "sync" as BroadcastMode);
  }
};
