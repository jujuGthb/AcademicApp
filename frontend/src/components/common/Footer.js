import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Akademik Yükseltme Sistemi</h3>
            <p>
              Akademik faaliyetlerinizi kaydedin, puanlarınızı hesaplayın ve yükseltme başvurularınızı kolayca yönetin.
            </p>
          </div>
          <div className="footer-section">
            <h3>Hızlı Erişim</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Ana Sayfa</a>
              </li>
              <li>
                <a href="/points-table">Puan Tablosu</a>
              </li>
              <li>
                <a href="/criteria">Kriterler</a>
              </li>
              <li>
                <a href="/login">Giriş</a>
              </li>
              <li>
                <a href="/register">Kayıt</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>İletişim</h3>
            <p>
              <strong>Adres:</strong> Kocaeli Üniversitesi, Umuttepe Kampüsü, 41380, İzmit/Kocaeli
            </p>
            <p>
              <strong>Telefon:</strong> +90 (262) 303 10 00
            </p>
            <p>
              <strong>E-posta:</strong> info@kocaeli.edu.tr
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Akademik Yükseltme Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
