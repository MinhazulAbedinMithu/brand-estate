import { connectDB } from '../lib/db/mongoose';
import { BlogPost } from '../lib/db/models/blog-post.model';

async function main() {
  await connectDB();
  const count = await BlogPost.countDocuments();
  console.log(`Total blogs in database: ${count}`);

  const posts = await BlogPost.find({}, 'title slug status views reactions');
  posts.forEach((p) => {
    const totalReactions = p.reactions instanceof Map 
      ? (Array.from(p.reactions.values()) as number[]).reduce((a, b) => a + b, 0)
      : (Object.values(p.reactions || {}) as number[]).reduce((a, b) => a + b, 0);
    console.log(`- [${p.status}] ${p.title} (${p.slug}) - ${p.views || 0} views, ${totalReactions} reacts`);
  });
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
