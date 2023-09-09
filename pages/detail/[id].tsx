import { useRouter } from "next/router";
import { Header } from "@/components/header";
import React, { useEffect, useState } from "react";
import { getProposal } from "@/util/api";
import { chainInfo } from "@/constant";
import { ResponseProposal } from "@/types";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { VoteModal } from "@/components/vote-modal";

export type VoteOption = "yes" | "no" | "no_with_veto" | "abstain";

export default function Id() {
  const router = useRouter();

  const [proposal, setProposal] = useState<ResponseProposal>();

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setProposal(await getProposal(chainInfo, router.query.id as string));
      }
    })();
  }, [router.query.id]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 100px",
      }}
    >
      <Header />

      {proposal ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              marginTop: "36px",
            }}
          >
            <div>
              <Image
                src="https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/chain.png"
                width={50}
                height={50}
                alt="osmosis logo"
              />
            </div>
            <div
              style={{
                fontWeight: "500",
                fontSize: "24px",
                color: "white",
                flex: "1",
              }}
            >
              #{proposal.proposal_id} {proposal.content.title}
            </div>

            <div>
              <button
                style={{
                  height: "44px",
                  padding: "0 16px",
                  border: "none",
                  color: "#FEFEFE",
                  borderRadius: "6px",
                  background: "#1D816F",
                  fontSize: "15px",
                }}
                onClick={() => openModal()}
              >
                Vote
              </button>
            </div>
          </div>

          <div style={{ fontWeight: 600, fontSize: "28px", marginTop: "50px" }}>
            Description
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: "15px",
              lineHeight: "150%",
            }}
          >
            <ReactMarkdown>{proposal.content.description}</ReactMarkdown>
          </div>
        </div>
      ) : null}

      <VoteModal
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        proposal={proposal}
      />
    </div>
  );
}
