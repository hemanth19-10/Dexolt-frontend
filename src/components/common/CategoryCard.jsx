import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => (
  <Link to={`/products?category=${category._id}`} className="group rounded-2xl border border-violet-100 bg-white p-5 text-center shadow-sm hover:-translate-y-1 hover:border-brand-blue hover:shadow-lg">
    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-3xl group-hover:bg-brand-blue">🧹</div>
    <h3 className="font-bold text-slate-800">{category.name}</h3>
  </Link>
)
export default CategoryCard