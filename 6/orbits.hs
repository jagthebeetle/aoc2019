import qualified Data.Map as M
import qualified Data.Text as T

type Node = (Integer, [String])
type NodeManifest = M.Map String Node
type DereferencedNode = (Integer, [Node])
type Graph = [Node]

splitEdge :: String -> (String, String)
splitEdge [] = ("", "")
splitEdge (c:cs)
  | c == ',' = ("", cs)
  | otherwise = (c:left, right)
  where (left, right) = splitEdge cs

parseIntoNode :: T.Text -> (String, Node)
parseIntoNode x = (node, (0, [child]))
  where (node, child) = splitEdge $ T.unpack x

buildNodeManifest :: String -> NodeManifest
buildNodeManifest x = M.fromList $ map parseIntoNode (T.splitOn (T.pack "\n") $ T.pack x)

buildGraph :: NodeManifest -> Graph
buildGraph nodes = map (\(weight, childIds) -> (weight, map M.! childIds)) nodes


getWeight :: Node -> Integer -> Integer
getWeight (weight, _) acc = weight + acc

getNodeSum :: String -> Integer
getNodeSum contents = foldr getWeight 0 $ buildNodeManifest contents

main = do
  contents <- readFile "input.txt"
  print $ getNodeSum contents
