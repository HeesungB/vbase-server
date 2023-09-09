import { useRouter } from "next/router";
import { Header } from "@/components/header";
import React, { useEffect, useState } from "react";
import { getProposal } from "@/util/api";
import { chainInfo } from "@/constant";
import { ResponseProposal, Review } from "@/types";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { VoteModal } from "@/components/vote-modal";
import { set } from "zod";

export type VoteOption = "yes" | "no" | "no_with_veto" | "abstain";

export default function Id() {
  const router = useRouter();

  const [proposal, setProposal] = useState<ResponseProposal>();
  const [reviews, setReviews] = useState<Review[]>([]);

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

        const response = await fetch(
          `/api/get_proposal_review?proposalId=${router.query.id as string}`
        );

        setReviews(await response.json());
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "40px",
          gap: "20px",
        }}
      >
        {reviews.map((review) => (
          <div
            key={`${review.proposalId}-${review.address}-${review.voteResult}`}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
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
                {review.address}
              </div>
            </div>

            <div
              style={{
                borderRadius: "0 0 15px 15px",
                background: "#F6F6F9",
                color: "#083E34",
                padding: "25px",
              }}
            >
              {review.review.length === 0 ? (
                <div style={{ color: "#31876D" }}>Not review yet</div>
              ) : (
                <div style={{ color: "#31876D" }}>{review.review}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <VoteModal
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        proposal={proposal}
      />
    </div>
  );
}
