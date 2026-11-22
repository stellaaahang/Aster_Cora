import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Product from './pages/Product';
import Applications from './pages/Applications';
import About from './pages/About';
import Value from './pages/Value';
import Contact from './pages/Contact';
// Pages has no server-side route rewrites; other hosts keep their existing URLs.
const Router = import.meta.env.MODE === 'github-pages' ? HashRouter : BrowserRouter;
export default function App() {
  return <I18nProvider><Router><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="product" element={<Product/>}/><Route path="technology" element={<Navigate to="/applications#technology" replace/>}/><Route path="applications" element={<Applications/>}/><Route path="about" element={<About/>}/><Route path="about/value" element={<Value/>}/><Route path="contact" element={<Contact/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></Router></I18nProvider>;
}
