import { useEffect, useState } from "react";
import { ResponseProposal } from "@/types";
import { getKeplrFromWindow } from "@/util/getKeplrFromWindow";
import { chainInfo } from "@/constant";
import { getProposals } from "@/util/api";
import { ProposalItem } from "@/components/proposal-item";
import { Header } from "@/components/header";

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [proposals, setProposals] = useState<ResponseProposal[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const keplr = await getKeplrFromWindow();

    if (keplr) {
      try {
        await keplr.enable(chainInfo.chainId);

        const address = await keplr.getKey(chainInfo.chainId);
        setAddress(address.bech32Address);

        const filteredProposals = await getProposals(chainInfo);
        setProposals(filteredProposals);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 100px",
      }}
    >
      <Header />

      {address.length === 0 ? (
        <div>
          <div
            style={{ fontSize: "18px", fontWeight: "500", marginTop: "64px" }}
          >
            ⚡️ Cast your vote & write on-chain proposal reviews
          </div>

          <div
            style={{ fontSize: "18px", fontWeight: "500", marginTop: "4px" }}
          >
            🔗 Upload your validator logo and other info on chain
          </div>

          <div>
            <button
              style={{
                height: "52px",
                padding: "9px 16px",
                border: "none",
                color: "#FEFEFE",
                borderRadius: "6px",
                background: "#1D816F",
                marginTop: "64px",
                fontSize: "18px",
              }}
            >
              Connect Keplr
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{ fontSize: "18px", fontWeight: "500", marginTop: "64px" }}
          >
            ✨ ️You need to first grant ‘vote’ permission to your Keplr account
            via Authz.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              marginTop: "40px",
              gap: "20px",
            }}
          >
            {proposals.map((proposal) => (
              <ProposalItem key={proposal.proposal_id} proposal={proposal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
