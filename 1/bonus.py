def fuel_exhaustively(m):
    f = 0;
    while m:
        m = max(m //3 - 2, 0)
        f+=m
    return f

with open('input.txt', 'r') as f:
    fuel = 0
    for l in f:
        fuel += fuel_exhaustively(int(l))
    print(fuel)
