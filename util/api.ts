import { ResponseProposal } from "@/types";
import { ChainInfo } from "@keplr-wallet/types";

export const getProposals = async (
  chainInfo: ChainInfo
): Promise<ResponseProposal[]> => {
  const response = await fetch(
    `${chainInfo.rest}/cosmos/gov/v1beta1/proposals?pagination.limit=3000`
  );
  const data = await response.json();

  return (data.proposals as ResponseProposal[]).filter(
    (proposal) => proposal.status === "PROPOSAL_STATUS_VOTING_PERIOD"
  );
};

export const getProposal = async (chainInfo: ChainInfo, proposalId: string) => {
  const response = await fetch(
    `${chainInfo.rest}/cosmos/gov/v1beta1/proposals/${proposalId}`
  );
  const responseProposal = await response.json();

  return responseProposal.proposal;
};

export const checkVote = async (
  chainInfo: ChainInfo,
  proposalId: string,
  voter: string
) => {
  const response = await fetch(
    `${chainInfo.rest}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${voter}`
  );

  if (response.ok) {
    const vote = await response.json();
    return vote.vote;
  }

  return undefined;
};

export const getAuthzInfo = async () => {};
