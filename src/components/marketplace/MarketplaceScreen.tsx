import React, { useState, useEffect } from 'react';
import { MarketplaceItem, MarketplaceCategory } from '../../types';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  Tag,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Check,
  X,
  Upload,
} from 'lucide-react';

export const MarketplaceScreen: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'todos' | 'novo' | 'seminovo' | 'servico'>('todos');

  // New Listing Modal
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('tenis');
  const [condition, setCondition] = useState<'novo' | 'seminovo' | 'servico'>('seminovo');
  const [imageUrl, setImageUrl] = useState('');
  const [contact, setContact] = useState('(11) 98765-4321');
  const [city, setCity] = useState(user?.city ? `${user.city}, ${user.state || 'SP'}` : 'São Paulo, SP');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);

  // Contact Seller Modal
  const [contactingItem, setContactingItem] = useState<MarketplaceItem | null>(null);
  const [copiedContact, setCopiedContact] = useState(false);

  const loadItems = async () => {
    const data = await StorageService.getMarketplaceItems();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleToggleSave = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = await StorageService.toggleSaveMarketplaceItem(itemId);
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isSaved: saved } : item))
    );
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    setIsSubmitting(true);
    await StorageService.saveMarketplaceItem({
      title: title.trim(),
      description: description.trim() || 'Produto esportivo anunciado na comunidade IPACE.',
      price: parseFloat(price.replace(',', '.')) || 99.0,
      category,
      condition,
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      sellerId: user?.id || 'usr_carlos_01',
      sellerName: user?.name || 'Carlos Silva',
      sellerAvatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      sellerRating: 5.0,
      sellerCity: city,
      sellerContact: contact,
      badge: condition === 'servico' ? 'Serviço Profissional' : 'Anúncio Verificado',
      isSaved: false,
    });

    setIsSubmitting(false);
    setListingSuccess(true);
    setTimeout(() => {
      setListingSuccess(false);
      setIsListingOpen(false);
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      loadItems();
    }, 1500);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;
    if (conditionFilter !== 'todos' && item.condition !== conditionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sellerCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'tenis', label: '👟 Tênis & Placa' },
    { id: 'relogios', label: '⌚ Relógios & GPS' },
    { id: 'servicos', label: '📋 Serviços & Treinos' },
    { id: 'suplementos', label: '⚡ Géis & Nutrição' },
    { id: 'vestuario', label: '🎽 Vestuário UV' },
    { id: 'acessorios', label: '🎒 Coletes & Cintos' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ipace-primary)] shrink-0">
              Marketplace de Corrida
            </span>
            <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
            <h2 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-[var(--ipace-text)] truncate">
              Produtos e Serviços Esportivos
            </h2>
          </div>
          <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
            Compre, venda e anuncie equipamentos de corrida e serviços de assessoria.
          </p>
        </div>

        {/* Anunciar button */}
        <button
          type="button"
          onClick={() => setIsListingOpen(true)}
          className="self-start sm:self-auto px-5 py-3 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md flex items-center gap-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Anunciar Produto ou Serviço
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ipace-text-2)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tênis de placa, Garmin, géis Maurten, consultorias de treino..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                  : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge Condition */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                  {item.condition === 'servico'
                    ? '💼 Serviço'
                    : item.condition === 'novo'
                    ? '✨ Novo'
                    : '♻️ Seminovo'}
                </span>

                {/* Save bookmark button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(item.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:text-[var(--ipace-primary)] backdrop-blur-md transition-colors cursor-pointer"
                  title="Salvar produto"
                >
                  <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-current text-[var(--ipace-primary)]' : ''}`} />
                </button>

                {/* Category & Badge */}
                {item.badge && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[var(--ipace-primary)] text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--ipace-primary)] uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.sellerCity}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--ipace-text-2)]">
                    {item.createdAt}
                  </span>
                </div>

                <h3 className="font-heading font-black text-sm text-[var(--ipace-text)] line-clamp-2 leading-tight group-hover:text-[var(--ipace-primary)] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--ipace-text-2)] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Seller info */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--ipace-border)]">
                  <img
                    src={item.sellerAvatar}
                    alt={item.sellerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="truncate text-[11px] text-[var(--ipace-text-2)]">
                    Vendedor: <strong className="text-[var(--ipace-text)]">{item.sellerName}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Contact Button */}
            <div className="p-4 pt-2 border-t border-[var(--ipace-border)] flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase text-[var(--ipace-text-2)] block">
                  Valor
                </span>
                <span className="font-heading font-black text-xl text-[var(--ipace-text)]">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setContactingItem(item);
                  setCopiedContact(false);
                }}
                className="px-4 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Negociar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE LISTING MODAL */}
      {isListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative my-auto animate-scale-up">
            {listingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-xl text-[var(--ipace-text)]">
                  Anúncio Publicado com Sucesso!
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  Seu item já está visível para toda a comunidade de atletas do IPACE.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-3.5">
                <div>
                  <h3 className="font-heading font-black text-xl text-[var(--ipace-text)] mb-0.5">
                    Anunciar Produto ou Serviço
                  </h3>
                  <p className="text-xs text-[var(--ipace-text-2)]">
                    Desapegue de equipamentos de corrida ou ofereça serviços de assessoria e saúde.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Título do Anúncio
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Tênis Asics Novablast 4 — Tam 42"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Categoria
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    >
                      <option value="tenis">Tênis & Calçados</option>
                      <option value="relogios">Relógios & GPS</option>
                      <option value="servicos">Serviços & Treinamento</option>
                      <option value="suplementos">Suplementos & Géis</option>
                      <option value="vestuario">Vestuário Esportivo</option>
                      <option value="acessorios">Acessórios & Hidratação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Condição
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    >
                      <option value="novo">Novo com etiqueta</option>
                      <option value="seminovo">Seminovo / Pouco uso</option>
                      <option value="servico">Serviço / Assessoria</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Preço (R$)
                    </label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 450,00"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      WhatsApp / Contato
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Descrição Detalhada &amp; Estado
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Quilometragem rodada, tamanho, detalhes de conservação..."
                    className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                    URL da Imagem da Foto (ou deixe em branco para foto padrão)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--ipace-border)]">
                  <button
                    type="button"
                    onClick={() => setIsListingOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Anúncio'}
                  </button>
                </div>
              </form>
            )}

            <button
              type="button"
              onClick={() => setIsListingOpen(false)}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {contactingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-up text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[var(--ipace-primary)] rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-1">
              Contato com Vendedor
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-4">
              Você está negociando: <strong>{contactingItem.title}</strong>
            </p>

            <div className="bg-[var(--ipace-surface-2)] p-4 rounded-2xl border border-[var(--ipace-border)] space-y-2 mb-4">
              <div className="text-xs text-[var(--ipace-text)]">
                Vendedor: <strong>{contactingItem.sellerName}</strong>
              </div>
              <div className="font-heading font-black text-lg text-[var(--ipace-primary)]">
                {contactingItem.sellerContact}
              </div>
              <div className="text-[10px] text-[var(--ipace-text-2)]">
                Localização: {contactingItem.sellerCity}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(contactingItem.sellerContact);
                  setCopiedContact(true);
                  setTimeout(() => setCopiedContact(false), 2000);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface)] text-xs font-bold text-[var(--ipace-text)] flex items-center justify-center gap-1.5"
              >
                {copiedContact ? <Check className="w-4 h-4 text-emerald-500" /> : <Tag className="w-4 h-4" />}
                {copiedContact ? 'Número Copiado!' : 'Copiar Contato'}
              </button>

              <button
                type="button"
                onClick={() => setContactingItem(null)}
                className="w-full py-2.5 px-4 rounded-xl font-heading font-black text-xs uppercase text-white bg-[var(--ipace-primary)]"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
