import { MathStudio } from "@/components/math-studio";
import { getStaticPosts } from "@/lib/posts";

export default function Page() {
  const posts = getStaticPosts();
  return <MathStudio initialPosts={posts} />;
}
