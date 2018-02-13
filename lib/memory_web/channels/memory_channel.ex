defmodule MemoryWeb.MemoryChannel do
  use MemoryWeb, :channel
alias Memory.Game

def join("room:" <> name, payload, socket) do
IO.puts("entered join")
  if authorized?(payload) do
  curState = Memory.MemoryBackup.load(name) || Game.load_view()
  socket = socket |> assign(:curState, curState)
  socket = socket |> assign(:name, name)
  #Memory.MemoryBackup.save(socket.assigns[:name], socket.assigns[:curState])
  {:ok,%{"newState" => curState}, socket}
  else
    {:error, %{reason: "unauthorized"}}
  end
end

def handle_in("reset", %{}, socket) do
  curstate = socket.assigns[:curState]
  name = socket.assigns[:name]
  newState = Game.reset()
  socket = assign(socket, :curState, newState)
  Memory.MemoryBackup.save(name, newState)
  {:reply, {:ok, %{ "newState" => newState }}, socket}
 end

 def handle_in("clicked", %{"number" => number, "letter" => letter}, socket) do
   curstate = socket.assigns[:curState]
   name = socket.assigns[:name]
   IO.puts("name is #{name}")
   IO.inspect(curstate)
   newState = Game.unwind(curstate, number, letter)
   socket = assign(socket, :curState, newState)
   Memory.MemoryBackup.save(name, newState)
   {:reply, {:ok, %{ "newState" => newState }}, socket}
 end

def handle_in("handleupdates", %{"open1" => open1, "open2" => open2, "open1index" => open1index, "open2index" => open2index}, socket) do

  curstate = socket.assigns[:curState]
  name = socket.assigns[:name]
  newState = Game.check(curstate, open1, open2, open1index, open2index)
  socket = assign(socket, :curState, newState)
  Memory.MemoryBackup.save(name, newState)
  {:reply, {:ok, %{ "newState" => newState }}, socket}
end

def handle_in("updateScore", %{"open1"=>open1, "open2" => open2, "score" => score}, socket) do
  curstate = socket.assigns[:curState]
  name = socket.assigns[:name]
  newState = Game.updateScore(curstate, open1, open2, score)
  socket = assign(socket, :curState, newState)
  Memory.MemoryBackup.save(name, newState)
  {:reply, {:ok, %{ "newState" => newState }}, socket}
end


defp authorized?(_payload) do
   true
 end

end
