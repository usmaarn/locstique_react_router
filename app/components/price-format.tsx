import { NumericFormat, type NumericFormatProps } from "react-number-format";

export function PriceFormat(props: NumericFormatProps) {
  return (
    <NumericFormat
      displayType="text"
      decimalScale={2}
      prefix="$"
      thousandSeparator
      {...props}
    />
  );
}
