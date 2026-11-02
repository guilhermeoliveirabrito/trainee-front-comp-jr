import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout__content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}