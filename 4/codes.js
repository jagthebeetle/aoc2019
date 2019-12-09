const adj_re =
    /[^1]11[^1]|^11[^1]|[^1]11$|[^2]22[^2]|^22[^2]|[^2]22$|[^3]33[^3]|^33[^3]|[^3]33$|[^4]44[^4]|^44[^4]|[^4]44$|[^5]55[^5]|^55[^5]|[^5]55$|[^6]66[^6]|^66[^6]|[^6]66$|[^7]77[^7]|^77[^7]|[^7]77$|[^8]88[^8]|^88[^8]|[^8]88$|[^9]99[^9]|^99[^9]|[^9]99$|00/;

let possibleCodes = 0;
for (let i = 347312; i <= 805915; i++) {
  const s = String(i);
  if (hasTwoAdjacentDigits(s) && isLexicallyMonotoneIncreasing(s)) {
    possibleCodes++;
  }
}

console.info(possibleCodes);

function hasTwoAdjacentDigits(s) {
  let repeatedCount = 0;
  for (let i = 0; i < s.length - 1; ++i) {
    if (s[i] === s[i + 1]) {
      repeatedCount++;
    } else {
      if (repeatedCount === 2) {
        return true;
      }
      repeatedCount = 0;
    }
  }
  return repeatedCount === 2;
}

function isLexicallyMonotoneIncreasing(s) {
  for (let i = 0; i < 5; i++) {
    if (s[i + 1] < s[i]) {
      return false;
    }
  }

  return true;
}
