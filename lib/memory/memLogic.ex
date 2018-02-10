defmodule Memory.Logic do
 def new do
 %{
   originalTiles: [],
   visible: [],
   open1: "",
   open1index: "",
   open2: "",
   open2index: "",
   Gap: false,
   score: 0,
   clicks: 0
 }
end

def load_view() do
arr = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]
%{
  originalTiles: Enum.shuffle(arr),
  visible: ["X","X","X","X","X","X","X","X","X","X","X","X","X","X","X","X"],
  open1: "",
  open1index: "",
  open2: "",
  open2index: "",
  Gap: false,
  score: 0,
  clicks: 0
}

 end

 def reset() do
   load_view()
  end

def unwind(prevstate, number, letter) do
  visibleArray = prevstate.visible
  originalArray = prevstate.originalTiles
  open1 = prevstate.open1
  open2 = prevstate.open2
  index1 = prevstate.open1index
  index2 = prevstate.open2index
  score = prevstate.score
  clicks =prevstate.clicks
  new_value = Enum.at(originalArray, number)
  {open1, index1, open2, index2, score, clicks}  = cond do
    open1 == "" -> {new_value, number, "", "",score,clicks + 1}
    open1 != "" && open2 == "" && number == index1 -> {new_value, number, "","", score,clicks}
    open1 != "" && open2 == "" && new_value == open1 -> {open1, index1, new_value, index2, score + 3, clicks + 1}
    open2 == "" -> {open1, index1, new_value, number, score - 1,clicks + 1}
    open1!= "" && open2 != "" && number == index2 ->{open1, index1, new_value, number, score,clicks}
    true -> {new_value, number, "", "", score,clicks + 1}
  end
  visibleArray = List.replace_at(visibleArray, number, new_value)
  %{prevstate | visible: visibleArray, open1: open1, open1index: index1, open2: open2, open2index: index2, score: score, clicks: clicks}
end

def check(prevstate, open1, open2, open1index, open2index) do
  visibleArray = prevstate.visible
  visibleArray = List.replace_at(visibleArray, open1index, "X")
  visibleArray = List.replace_at(visibleArray, open2index, "X")
  {open1, open1index, open2, open2index} = {"", "", "", ""}
  %{prevstate | visible: visibleArray, open1: open1, open2: open2, open1index: open1index, open2index: open2index}
end

def updateScore(prevstate, open1, open2, score) do
if(open1 == open2) do
  score = score + 5
else
  score = score - 1
end
%{prevstate | score: score}
end

end
