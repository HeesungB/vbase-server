import {Review} from "@/types/review";

export interface Proposal {
  chainId: string;
  proposalId: string;
  reviews: Review[];
}
