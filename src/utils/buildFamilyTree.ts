import type { FamilyMember } from '../data/types';

export type FamilyTreeNode = {
  member: FamilyMember;
  partner?: FamilyMember;
  children: FamilyTreeNode[];
};

const SPOUSE_RELS = new Set(['Husband', 'Wife']);

export function isSpouse(relationship?: string) {
  return Boolean(relationship && SPOUSE_RELS.has(relationship));
}

/** Spouse linked either way (Husband/Wife), ignoring tree-build visitation. */
export function getSpouseOf(member: FamilyMember, members: FamilyMember[]) {
  const asSpouse = members.find(
    (candidate) =>
      candidate.id !== member.id &&
      candidate.connectedToId === member.id &&
      isSpouse(candidate.relationship),
  );
  if (asSpouse) {
    return asSpouse;
  }

  if (member.connectedToId && isSpouse(member.relationship)) {
    return members.find((candidate) => candidate.id === member.connectedToId);
  }

  return undefined;
}

function findPartner(member: FamilyMember, members: FamilyMember[], used: Set<string>) {
  const partner = getSpouseOf(member, members);
  if (partner && !used.has(partner.id)) {
    return partner;
  }
  return undefined;
}

function getChildren(parentIds: string[], members: FamilyMember[], used: Set<string>) {
  return members.filter(
    (member) =>
      member.connectedToId &&
      parentIds.includes(member.connectedToId) &&
      !isSpouse(member.relationship) &&
      !used.has(member.id),
  );
}

function buildNode(
  member: FamilyMember,
  members: FamilyMember[],
  used: Set<string>,
): FamilyTreeNode {
  used.add(member.id);
  const partner = findPartner(member, members, used);
  if (partner) {
    used.add(partner.id);
  }

  const parentIds = partner ? [member.id, partner.id] : [member.id];
  const children = getChildren(parentIds, members, used).map((child) =>
    buildNode(child, members, used),
  );

  return { member, partner, children };
}

export function buildFamilyTree(members: FamilyMember[]): FamilyTreeNode[] {
  const used = new Set<string>();
  const byId = new Map(members.map((member) => [member.id, member]));

  const roots = members.filter((member) => {
    if (!(member.isRoot || !member.connectedToId)) {
      return false;
    }

    if (isSpouse(member.relationship) && member.connectedToId) {
      const target = byId.get(member.connectedToId);
      if (target && (target.isRoot || !target.connectedToId)) {
        return false;
      }
    }

    return true;
  });

  const tree = roots
    .filter((member) => !used.has(member.id))
    .map((member) => buildNode(member, members, used));

  const orphans = members
    .filter((member) => !used.has(member.id))
    .map((member) => buildNode(member, members, used));

  return [...tree, ...orphans];
}
