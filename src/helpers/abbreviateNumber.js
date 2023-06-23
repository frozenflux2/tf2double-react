const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function abbreviateNumber(number){
  const tier = Math.log10(Math.abs(number)) / 3 | 0;

  // if zero, we don't need a suffix
  if(tier === 0) return number.toFixed(2);

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
}

export default abbreviateNumber;