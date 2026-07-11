"use client";

import { useState, useMemo } from "react";
import { BookOpen, Plus, Trash2, Edit, Search, Loader2, Bookmark, FolderOpen } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "@/features/library";
import { RootState } from "@/store";

export default function BooksInventoryPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Form states for creating/editing books
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [rackLocation, setRackLocation] = useState("");

  const queryParams = useMemo(() => {
    return {
      search: search || undefined,
      category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    };
  }, [search, categoryFilter]);

  const { data: books, isLoading } = useBooksQuery(queryParams);

  const { mutate: createBook, isPending: isCreating } = useCreateBookMutation();
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBookMutation();
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBookMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !isbn || !category) return;

    const payload = {
      title,
      author,
      publisher: publisher || undefined,
      isbn,
      category,
      totalCopies: Number(totalCopies),
      rackLocation: rackLocation || undefined,
    };

    if (editingBookId) {
      updateBook({ id: editingBookId, data: payload }, {
        onSuccess: () => resetForm()
      });
    } else {
      createBook(payload, {
        onSuccess: () => resetForm()
      });
    }
  };

  const handleEdit = (book: any) => {
    setEditingBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setPublisher(book.publisher || "");
    setIsbn(book.isbn);
    setCategory(book.category);
    setTotalCopies(book.totalCopies);
    setRackLocation(book.rackLocation || "");
  };

  const resetForm = () => {
    setEditingBookId(null);
    setTitle("");
    setAuthor("");
    setPublisher("");
    setIsbn("");
    setCategory("");
    setTotalCopies(1);
    setRackLocation("");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete book title "${name}" from inventory?`)) {
      deleteBook(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-400" /> Library Catalog Inventory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog textbooks, check copies availability, track physical rack positions, and manage titles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* CRUD Form (Admins only) */}
        {isAdmin && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              {editingBookId ? <Edit className="h-4.5 w-4.5 text-indigo-400" /> : <Plus className="h-4.5 w-4.5 text-indigo-400" />}
              {editingBookId ? "Edit Book Registry" : "Catalog New Title"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Book Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Introduction to Algorithms"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Author Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Thomas H. Cormen"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">ISBN Code</label>
                  <input
                    required
                    type="text"
                    placeholder="ISBN-13"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. COMPUTERS"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Total Copies</label>
                  <input
                    required
                    type="number"
                    min={1}
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Rack Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Shelf A-3"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={rackLocation}
                    onChange={(e) => setRackLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Publisher (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MIT Press"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editingBookId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 border-slate-805 text-slate-400 h-9"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingBookId ? (
                    "Save Changes"
                  ) : (
                    "Catalog Title"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Display Inventory grid */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="h-4.5 w-4.5 text-indigo-400" /> Book Registry List
            </h3>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-500">
                  <Search className="h-3 w-3" />
                </span>
                <input
                  type="text"
                  placeholder="ISBN, Title, Author..."
                  className="h-8 w-44 rounded border border-slate-850 bg-slate-900/40 pl-7 pr-2 text-[10px] text-slate-300 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
          ) : books?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                    <th className="p-4">Book Details</th>
                    <th className="p-4">ISBN</th>
                    <th className="p-4 text-center">Available Copies</th>
                    <th className="p-4">Rack location</th>
                    <th className="p-4 text-center">Status</th>
                    {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-355">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-900/10">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{book.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Author: {book.author}</p>
                      </td>
                      <td className="p-4 font-mono">{book.isbn}</td>
                      <td className="p-4 text-center font-bold">
                        <span className={book.availableCopies > 0 ? "text-emerald-450" : "text-rose-455"}>
                          {book.availableCopies}
                        </span>
                        <span className="text-slate-600 font-normal"> / {book.totalCopies}</span>
                      </td>
                      <td className="p-4">{book.rackLocation || "-"}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold border text-[9px]
                          ${book.availableCopies > 0
                            ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-455 border-rose-500/20 animate-pulse"
                          }
                        `}>
                          {book.availableCopies > 0 ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                      </td>
                      {isAdmin ? (
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
                              onClick={() => handleEdit(book)}
                              disabled={isDeleting}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-slate-855 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => handleDelete(book._id, book.title)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 italic text-center p-8">No books recorded matching searches.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
