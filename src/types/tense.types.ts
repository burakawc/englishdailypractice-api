export enum EnglishTense {
  SIMPLE_PRESENT = 'simple_present',
  PRESENT_CONTINUOUS = 'present_continuous',
  SIMPLE_PAST = 'simple_past',
  PAST_CONTINUOUS = 'past_continuous',
  SIMPLE_FUTURE = 'simple_future',
  FUTURE_CONTINUOUS = 'future_continuous',
  PRESENT_PERFECT = 'present_perfect',
  PRESENT_PERFECT_CONTINUOUS = 'present_perfect_continuous',
  PAST_PERFECT = 'past_perfect',
  PAST_PERFECT_CONTINUOUS = 'past_perfect_continuous',
  FUTURE_PERFECT = 'future_perfect',
  FUTURE_PERFECT_CONTINUOUS = 'future_perfect_continuous',
}

export interface TenseOption {
  label: string;
  value: EnglishTense;
  enabled: boolean;
}

export const TENSE_OPTIONS: TenseOption[] = [
  {
    label: 'Geniş Zaman (Simple Present)',
    value: EnglishTense.SIMPLE_PRESENT,
    enabled: true,
  },
  {
    label: 'Şimdiki Zaman (Present Continuous)',
    value: EnglishTense.PRESENT_CONTINUOUS,
    enabled: true,
  },
  {
    label: 'Geçmiş Zaman (Simple Past)',
    value: EnglishTense.SIMPLE_PAST,
    enabled: true,
  },
  {
    label: 'Geçmişte Şimdiki Zaman (Past Continuous)',
    value: EnglishTense.PAST_CONTINUOUS,
    enabled: true,
  },
  {
    label: 'Gelecek Zaman (Simple Future)',
    value: EnglishTense.SIMPLE_FUTURE,
    enabled: true,
  },
  {
    label: 'Gelecekte Şimdiki Zaman (Future Continuous)',
    value: EnglishTense.FUTURE_CONTINUOUS,
    enabled: true,
  },
  {
    label: 'Yakın Geçmiş (Present Perfect)',
    value: EnglishTense.PRESENT_PERFECT,
    enabled: true,
  },
  {
    label: 'Yakın Geçmişte Şimdiki Zaman (Present Perfect Continuous)',
    value: EnglishTense.PRESENT_PERFECT_CONTINUOUS,
    enabled: true,
  },
  {
    label: 'Miș Geçmiş (Past Perfect)',
    value: EnglishTense.PAST_PERFECT,
    enabled: true,
  },
  {
    label: 'Miș Geçmişte Şimdiki Zaman (Past Perfect Continuous)',
    value: EnglishTense.PAST_PERFECT_CONTINUOUS,
    enabled: true,
  },
  {
    label: 'Gelecekte Miș Geçmiş (Future Perfect)',
    value: EnglishTense.FUTURE_PERFECT,
    enabled: true,
  },
  {
    label: 'Gelecekte Miș Geçmişte Şimdiki Zaman (Future Perfect Continuous)',
    value: EnglishTense.FUTURE_PERFECT_CONTINUOUS,
    enabled: true,
  },
];
