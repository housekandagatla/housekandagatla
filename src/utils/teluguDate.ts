import { PANCH } from '@mera-vansh/ms-panchang';

export type FamilyDateLabel = {
  gregorian: string;
  telugu: string;
  full: string;
};

function formatGregorian(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getFamilyDateLabel(date: Date = new Date()): FamilyDateLabel {
  const gregorian = formatGregorian(date);

  try {
    const panchang = PANCH.call({
      date,
      cityName: 'Hyderabad',
      lang: 'te',
      region: 'south',
    });

    const month = panchang.month?.name ?? '';
    const paksha = panchang.tithi?.pakshaName ?? '';
    const tithi = panchang.tithi?.name ?? '';
    const vara = panchang.vara?.name ?? '';
    const telugu = [month, paksha, tithi, vara].filter(Boolean).join(' · ');

    return {
      gregorian,
      telugu,
      full: telugu ? `${gregorian} · ${telugu}` : gregorian,
    };
  } catch {
    return {
      gregorian,
      telugu: '',
      full: gregorian,
    };
  }
}
