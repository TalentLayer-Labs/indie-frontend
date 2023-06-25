import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
console.log(process.env.GITHUB_CLIENT_ID);
console.log(process.env.GITHUB_CLIENT_SECRET);
export default NextAuth({
    providers: [
        GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    ]
})