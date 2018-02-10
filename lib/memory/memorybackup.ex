defmodule Memory.MemoryBackup do
  use Agent
def start_link do
  Agent.start_link(fn -> %{} end, name: __MODULE__)
end

def save(name, game) do
  IO.puts("entered save")
  Agent.update __MODULE__, fn state -> Map.put(state, name, game)
end
end

def load(name) do
  IO.puts("entered loads #{name}" )
  Agent.get __MODULE__, fn state -> Map.get(state, name)
end
end

end
