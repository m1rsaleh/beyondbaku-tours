import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Facebook, Twitter, MessageCircle, ChevronRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title_az: string;
  title_en: string;
  title_ru: string;
  excerpt_az: string;
  excerpt_en: string;
  excerpt_ru: string;
  content_az: string;
  content_en: string;
  content_ru: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

function getLangField(obj: any, base: string, lang: string) {
  return obj[`${base}_${lang}`] || obj[`${base}_az`] || obj[`${base}_en`] || obj[`${base}_ru`] || "";
}

export default function BlogDetail() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language as 'az' | 'en' | 'ru';
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const data = await blogService.getBySlug(slug);
        setPost(data);

        //-- İlgili yazılar
        if (data) {
          const { data: rel } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', data.category)
            .neq('slug', data.slug)
            .eq('status', 'published')
            .limit(3);
          setRelatedPosts(rel || []);
        }
      } catch {
        setPost(null);
        setRelatedPosts([]);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Blog bulunamadı</div>;

  const title = getLangField(post, "title", lang);
  const content = getLangField(post, "content", lang);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={post.image}
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{post.category}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
              <div className="flex items-center gap-6 text-white/90">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                {/* <span className="flex items-center gap-2"><Clock className="w-4 h-4" />5 min</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mw-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
            <div
              className="rose prose-lg max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: content }}
               style={{ fontSize: '18px', lineHeight: '1.8', color: '#374151' }}
            />
          </div>
          {/* Share Buttons */}
          {/* ... paylaş butonları ... */}
          {/* Related Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relTitle = getLangField(relatedPost, "title", lang);
                return (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={relatedPost.image}
                        alt={relTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-blue-600 font-semibold">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relTitle}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
