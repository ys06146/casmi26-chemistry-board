import { getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath } from "./chatgpt-auth";
import Board from "./board";
export const dynamic="force-dynamic";
export default async function Page(){
 const user=await getChatGPTUser();
 return <Board signedIn={!!user} signIn={chatGPTSignInPath("/#write")} signOut={chatGPTSignOutPath("/")} />;
}

