#written by ChatGPT

import matplotlib.pyplot as plt

def parse_file(filepath):
    input_sizes = []
    times = []
    with open(filepath, 'r') as file:
        for line in file:
            if line.strip():
                parts = line.strip().split(',')
                if len(parts) >= 3:
                    times.append(float(parts[0]))
                    input_sizes.append(int(parts[2]))
    return input_sizes, times

# Parse both files
ls_inputs, ls_times = parse_file("C:Outputls.txt")
karp_inputs, karp_times = parse_file("C:Outputkarp.txt")

# Plot LS Time
plt.figure(figsize=(10, 6))
plt.plot(ls_inputs, ls_times, label='Local Search Time', color='blue', marker='o')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Local Search Runtime')
plt.grid(True)
plt.legend()
plt.savefig("ls_runtime.png")
plt.show()

# Plot Karp Time
plt.figure(figsize=(10, 6))
plt.plot(karp_inputs, karp_times, label='Held-Karp Time', color='green', marker='o')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Held-Karp Runtime')
plt.grid(True)
plt.legend()
plt.savefig("karp_runtime.png")
plt.show()

# Plot both together
plt.figure(figsize=(10, 6))
plt.plot(ls_inputs, ls_times, label='Local Search', color='blue', marker='o')
plt.plot(karp_inputs, karp_times, label='Held-Karp', color='green', marker='o')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Comparison of Runtimes: Local Search vs Held-Karp')
plt.grid(True)
plt.legend()
plt.savefig("comparison_runtime.png")
plt.show()




#plot the answer of karp vs ls

def parse_file(filepath):
    input_sizes = []
    times = []
    tour_lengths = []
    with open(filepath, 'r') as file:
        for line in file:
            if line.strip():
                parts = line.strip().split(',')
                if len(parts) >= 3:
                    times.append(float(parts[0]))
                    tour_lengths.append(float(parts[1]))
                    input_sizes.append(int(parts[2]))
    return input_sizes, times, tour_lengths

# Parse both files
ls_inputs, ls_times, ls_tours = parse_file("C:Outputls.txt")
karp_inputs, karp_times, karp_tours = parse_file("C:Outputkarp.txt")

# Plot Tour Length Comparison
plt.figure(figsize=(10, 6))
plt.plot(ls_inputs, ls_tours, label='Local Search Tour Length', color='blue', marker='x')
plt.plot(karp_inputs, karp_tours, label='Held-Karp Tour Length', color='green', marker='x')
plt.xlabel('Input Size')
plt.ylabel('Tour Length')
plt.title('Tour Length Comparison')
plt.grid(True)
plt.legend()
plt.savefig("tour_length_comparison.png")
plt.show()
