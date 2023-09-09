export interface ResponseProposal {
  proposal_id: string;
  status: string;
  content: {
    title: string;
    description: string;
  };
}
