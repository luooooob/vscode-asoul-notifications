import { AsoulMember, BilibiliUser } from "./types";

export const filterBilibiliUsers = (asoulMembers: AsoulMember[]) => {
	return asoulMembers
		.reduce((users, { bilibiliId, nickname }) => {
			return bilibiliId
				? [...users, { nickname, bilibiliId }]
				: users;
		}, [] as BilibiliUser[]);
};