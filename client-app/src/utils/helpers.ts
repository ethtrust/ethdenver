export function merge(str1: string, str2: string) {
  var arr1 = str1.split("");
  var arr2 = str2.split("");
  var result = "";
  var index1 = 0;
  var index2 = 0;
  while (index1 < arr1.length || index2 < arr2.length) {
    if (index1 < arr1.length) {
      result += arr1[index1];
      index1++;
    }
    if (index2 < arr2.length) {
      result += arr2[index2];
      index2++;
    }
  }
  return result;
}
