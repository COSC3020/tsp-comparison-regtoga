import matplotlib.pyplot as plt
import ast

def parse_times(filepath):
    with open(filepath, 'r') as file:
        lines = file.readlines()
    # Convert lines like "['0.53', 452]" to float time values
    return [float(ast.literal_eval(line.strip())[0]) for line in lines if line.strip()]

# Load time data from both files
ls_times = parse_times("C:Outputls.txt")
karp_times = parse_times("C:Outputkarp.txt")

# Input sizes (line number starting from 1)
input_sizes = list(range(1, len(ls_times) + 1))

# Plot LS Time
plt.figure(figsize=(10, 6))
plt.plot(input_sizes, ls_times, label='Local Search Time', color='blue')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Local Search Runtime')
plt.grid(True)
plt.legend()
plt.savefig("ls_runtime.png")
plt.show()

# Plot Karp Time
plt.figure(figsize=(10, 6))
plt.plot(input_sizes, karp_times, label='Held-Karp Time', color='green')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Held-Karp Runtime')
plt.grid(True)
plt.legend()
plt.savefig("karp_runtime.png")
plt.show()

# Plot both together
plt.figure(figsize=(10, 6))
plt.plot(input_sizes, ls_times, label='Local Search', color='blue')
plt.plot(input_sizes, karp_times, label='Held-Karp', color='green')
plt.xlabel('Input Size')
plt.ylabel('Time (seconds)')
plt.title('Comparison of Runtimes: Local Search vs Held-Karp')
plt.grid(True)
plt.legend()
plt.savefig("comparison_runtime.png")
plt.show()
