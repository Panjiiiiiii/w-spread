/**
 * Shared currency formatting helper for Indonesian Rupiah display.
 * Formats a numeric value with `Rp` prefix and `id-ID` thousands grouping,
 * e.g. formatRupiah(1234567) -> "Rp 1.234.567"
 *
 * Note: The Membership/paywall screen intentionally does NOT use this
 * helper, since it must keep displaying real USD RevenueCat/App Store/
 * Play Store subscription pricing.
 */
export function formatRupiah(value) {
  const amount = Number(value || 0);
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}
