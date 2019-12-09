The problem is to identify "sorted" numeric strings with at least one sequential pair of digits repeated.

## Definition 1
A number is sorted for our purposes if its digits, when read from left to right, are non-decreasing.

## Lemma 1
The number of sorted 3-digit sequences whose first digit is at least $n$ is:

$$sorted_{3}(n) = [9-n+1, 9-n, \dots, 1] \cdot [1, \dots, 9-n+1]$$
$$sorted_{3}(9) = [1] \cdot [1] = 1$$
$$sorted_{3}(8) = [2, 1] \cdot [1, 2] = 4$$
$$sorted_{3}(7) = [3, 2, 1] \cdot [1, 2, 3] = 10$$
$$sorted_{3}(6) = [4, 3, 2, 1] \cdot [1, 2, 3, 4] = 20$$
$$sorted_{3}(5) = [5, 4, 3, 2, 1] \cdot [1, 2, 3, 4, 5] = 35$$
$$sorted_{3}(4) = [6, 5, 4, 3, 2, 1] \cdot [1, 2, 3, 4, 5, 6] = 56$$

See [1] for a visual proof.

## Lemma 2
The number of sorted 4-digit sequences whose first digit is at least $n$ is:

$$sorted_{4}(n) = \sum_{i=n}^9 sorted_{3}(i)$$
$$sorted_{4}(9) = [1] \cdot [1] = 1$$
$$sorted_{4}(8) = [1] \cdot [1] + [2, 1] \cdot [1, 2] = 5$$
$$sorted_{4}(7) = [1] \cdot [1] + [2, 1] \cdot [1, 2]
                         + [3, 2, 1] \cdot [1, 2, 3] = 15$$
$$sorted_{4}(6) = [1] \cdot [1] + [2, 1] \cdot [1, 2] + [3, 2, 1] \cdot [1, 2, 3] +
                         [4, 3, 2, 1] \cdot [1, 2, 3, 4] = 35$$
$$sorted_{4}(5) = [1] \cdot [1] + [2, 1] \cdot [1, 2] + [3, 2, 1] \cdot [1, 2, 3] +
                         [4, 3, 2, 1] \cdot [1, 2, 3, 4] +
                         [5, 4, 3, 2, 1] \cdot [1, 2, 3, 4, 5] = 70$$
$$sorted_{4}(4) = [1] \cdot [1] + [2, 1] \cdot [1, 2] + [3, 2, 1] \cdot [1, 2, 3] +
                         [4, 3, 2, 1] \cdot [1, 2, 3, 4] +
                         [5, 4, 3, 2, 1] \cdot [1, 2, 3, 4, 5] +
                         [6, 5, 4, 3, 2, 1] \cdot [1, 2, 3, 4, 5, 6] = 126$$

With some term rearranging, this can be seen to be the L1 norm of the Hadamard product of matrices like the below with their own transpose. I'm not sure if this is the correct "next-dimension" for this class of functions, but it's superficially compelling.

$$A_{sorted_4(6)} = \begin{bmatrix}
1 & 2 & 3 & 4\\
1 & 2 & 3 & 0\\
1 & 2 & 0 & 0\\
1 & 0 & 0 & 0\\
\end{bmatrix}
$$

and

$$
A_{sorted_4(6)}^{\intercal} = \begin{bmatrix}
1 & 1 & 1 & 1\\
2 & 2 & 2 & 0\\
3 & 3 & 0 & 0\\
4 & 0 & 0 & 0\\
\end{bmatrix}
$$

$$sorted_4(6) = \|A_{sorted_4(6)} \odot A_{sorted_4(6)}^{\intercal} \|_{1}$$

## Lemma 3
Extending the above method, we get:
$$sorted_5(4) = 252$$
$$sorted_5(5) = 126$$
$$sorted_5(6) = 56$$
$$sorted_5(7) = 21$$

## Lemma 4
There are exactly 2 sorted values in the range $[347312, 805915]$ that do not have a repeated digit.
356789
456789

The second digit in the proposed sequence must be a 5 (higher and there wouldn't be enough digits to form a non-repeating, sorted string; lower and the string would not be in the range (e.g., 345678), it would be have a repeated digit (e.g., 445678), or it would not be sorted (e.g., 545678)). Since there are exactly 5 digits greater than or equal to 5 and these are totally ordered, we can be sure that the last 5 digits of the string must be 56789.

## Theorem 1
The number of sorted values in [347312, 805915] is 252 + 126 + 56 + 21 + 126 + 15 - 2.

There is no valid member of $sorted_5(8)$ in this range, so we may ignore it.

$sorted_5(3)$ must be intersected with the valid members of our range. the only valid sorted digits beginning with 347 and greater than 347312 are in the 347777 - 347999 range. This gives $sorted_4(7) = 15$.
The next valid range is the 355555 - 399999 range (i.e., $sorted_5(5)$).


[1]:
```
444-449
455-459 555-559
466-469 566-569 666-669
477-479 577-579 677-679 777-779
488-489 588-589 688-689 788-789 888-889
499-499 599-599 699-699 799-799 899-899 999-999
```
