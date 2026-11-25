import type { FamilyMember } from '../data/types';

export type FamilyTreeNode = {
  member: FamilyMember;
  partner?: FamilyMember;
  children: FamilyTreeNode[];
};

const SPOUSE_RELS = new Set(['husband', 'wife']);

export function isSpouse(relationship?: string) {
  return Boolean(relationship && SPOUSE_RELS.has(relationship.trim().toLowerCase()));
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

  // Mutual spouse links where the partner also points back.
  if (member.connectedToId) {
    const linked = members.find((candidate) => candidate.id === member.connectedToId);
    if (
      linked &&
      linked.connectedToId === member.id &&
      (isSpouse(member.relationship) || isSpouse(linked.relationship))
    ) {
      return linked;
    }
  }

  return undefined;
}

/** Human-readable placement like "Son of Krishna Murthy & Somalakshmi" or "Wife of Ramdev". */
export function getMemberPlacementLabel(member: FamilyMember, members: FamilyMember[]) {
  if (member.isRoot || !member.connectedToId) {
    return member.isRoot ? 'Family root' : member.relationship || 'Family member';
  }

  const connected = members.find((item) => item.id === member.connectedToId);
  if (!connected) {
    return member.relationship || 'Family member';
  }

  const relation = member.relationship || 'Family member';

  if (isSpouse(member.relationship)) {
    return `${relation} of ${connected.fullName}`;
  }

  const primary = isSpouse(connected.relationship)
    ? members.find((item) => item.id === connected.connectedToId) ?? connected
    : connected;
  const spouse = getSpouseOf(primary, members);
  const parents = spouse
    ? `${primary.fullName} & ${spouse.fullName}`
    : primary.fullName;

  return `${relation} of ${parents}`;
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

export type FamilyGenerationUnit = {
  member: FamilyMember;
  partner?: FamilyMember;
  parentsLabel?: string;
};

export type FamilyGeneration = {
  level: number;
  label: string;
  units: FamilyGenerationUnit[];
};

/** Flatten the descendant tree into generation rows for an alternate layout. */
export function buildFamilyGenerations(members: FamilyMember[]): FamilyGeneration[] {
  const tree = buildFamilyTree(members);
  const rows = new Map<number, FamilyGenerationUnit[]>();

  const visit = (node: FamilyTreeNode, level: number, parentsLabel?: string) => {
    const units = rows.get(level) ?? [];
    units.push({
      member: node.member,
      partner: node.partner,
      parentsLabel,
    });
    rows.set(level, units);

    const asParentsLabel = node.partner
      ? `${node.member.fullName} & ${node.partner.fullName}`
      : node.member.fullName;

    node.children.forEach((child) => visit(child, level + 1, asParentsLabel));
  };

  tree.forEach((node) => visit(node, 0));

  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, units]) => ({
      level,
      label: level === 0 ? 'Roots' : `Generation ${level + 1}`,
      units,
    }));
}
