with open('input.txt', 'r') as f:
  fuel = 0;
  for l in f:
    fuel += int(l) // 3 - 2
  print(fuel)
