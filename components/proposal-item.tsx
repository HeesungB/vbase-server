import { ResponseProposal } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { checkVote } from "@/util/api";
import { chainInfo } from "@/constant";

export const ProposalItem = ({ proposal }: { proposal: ResponseProposal }) => {
  const router = useRouter();

  const [vote, setVote] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const key = await window.keplr?.getKey(chainInfo.chainId);
      const voteResponse = await checkVote(
        chainInfo,
        proposal.proposal_id,
        key?.bech32Address || ""
      );
      if (voteResponse) {
        setVote(
          voteResponse.option.replace("VOTE_OPTION_", "").replaceAll("_", " ")
        );
      }
    })();
  }, []);

  return (
    <div
      key={proposal.proposal_id}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
      }}
      onClick={() => router.push(`/detail/${proposal.proposal_id}`)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: "15px 15px 0 0",
          background:
            "linear-gradient(90deg, rgba(122, 255, 204, 0.42) 51.78%, rgba(255, 255, 255, 0.05) 100%)",
          padding: "16px",
          gap: "4px",
        }}
      >
        <div>
          <Image
            src="https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/chain.png"
            width={30}
            height={30}
            alt="osmosis logo"
          />
        </div>
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          #{proposal.proposal_id} {proposal.content.title}
        </div>
      </div>

      <div
        style={{
          flex: "1",
          maxHeight: "150px",
          overflow: "hidden",
          background: "#F6F6F9",
          color: "#083E34",
          padding: "25px",
        }}
      >
        {proposal.content.description}
      </div>

      <div
        style={{
          borderRadius: "0 0 15px 15px",
          background: "#F6F6F9",
          color: "#083E34",
          padding: "25px",
        }}
      >
        {vote ? (
          <div style={{ color: "#31876D" }}>You Voted {vote} ✅</div>
        ) : (
          <div style={{ color: "#31876D" }}>Waiting for Your Vote ➡️</div>
        )}
      </div>
    </div>
  );
};
