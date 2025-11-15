import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { blogService } from "../services/blogService";
import { BlogPost, Category } from "../types";
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from "react-i18next";

// Dil bazlı alan yöneticisi
function getLangField(obj: any, base: string, lang: string) {
  return obj[`${base}_${lang}`] || obj[`${base}_az`] || obj[`${base}_en`] || obj[`${base}_ru`] || "";
}

export default function Blog() {
  const { i18n } = useTranslation();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
 const [categories, setCategories] = useState<Category[]>([
  {
    id: "all",
    name_tr: "Tümü",
    name_en: "All",
    name_ru: "Все",
    name_az: "Hamısı",
    slug: "all",
    icon: "",
    order_num: 0,
    status: "active"
  }
]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getPosts();
    getCategories();
    // eslint-disable-next-line
  }, [i18n.language]);

  const getPosts = async () => {
    try {
      setLoading(true);
      // argümansız çağır (çok dilli alan mapping'i frontendde çözeceğiz)
      const data = await blogService.getAll();
      setPosts(data || []);
    } catch (error) {
      showToast("error", "Blog yazıları yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const cats = await blogService.getCategories();
      setCategories([
        { id: "all", name_tr: "Tümü", name_en: "All", name_ru: "Все" },
        ...(cats || []),
      ]);
    } catch (error) {
      showToast("error", "Kategoriler yüklenirken hata oluştu");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const title = getLangField(post, "title", i18n.language);
    const excerpt = getLangField(post, "excerpt", i18n.language);
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-blue-100">
              Azerbaycan hakkında en güncel seyahat ipuçları, rehberler ve hikayeler
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {(category as any)[`name_${i18n.language}`] || category.name_tr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const title = getLangField(post, "title", i18n.language);
            const excerpt = getLangField(post, "excerpt", i18n.language);
            return (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img
                    src={post.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-gray-600 line-clamp-3 mb-4">{excerpt}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="text-blue-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Yazı Bulunamadı</h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun blog yazısı bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
