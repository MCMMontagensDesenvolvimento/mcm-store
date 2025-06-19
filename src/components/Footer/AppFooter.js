import React from 'react';

export function AppFooter() {
  const year = new Date().getFullYear();

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    footer {
      display: flex;
      flex-direction: column;
      background-color: #FE5A17;
      font-family: 'Montserrat', sans-serif;
      color: #e2e0e5;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2vw;
      padding: 20px 8vw;
      background-color: #FE5A17;
      color: #e2e0e5;
    }

    .footer .h5 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .brand {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      max-width: 180px;
      line-height: 1.4;
    }

    .brand img {
      max-height: 32px;
    }

    .social {
      display: flex;
      flex-direction: row;
      gap: 12px;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: rgba(255, 255, 255, 0.21);
      border-radius: 20%;
      transition: all 0.3s ease;
    }

    .social-icon:hover {
      background-color: #d9d9d9;
    }

    .social-icon:hover svg path {
      fill: #FE5A17;
    }

    .menus {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .menus-links {
      display: flex;
      flex-direction: row;
      gap: 16px;
      flex-wrap: wrap;
    }

    .menus a {
      text-decoration: none;
      color: #e2e0e5;
      position: relative;
      font-weight: 400;
      font-size: 14px;
    }

    .menus a::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e2e0e5;
      transform-origin: right;
      transform: scaleX(0);
      transition: transform 0.3s ease-in-out;
    }

    .menus a:hover::before {
      transform-origin: left;
      transform: scaleX(1);
    }

    .newsletter {
      display: none;
    }

    .copyright {
      display: flex;
      justify-content: center;
      padding: 12px 8vw;
      background-color: #FE5A17;
      color: white;
    }

    .copyright p {
      margin: 0;
      font-size: 12px;
      font-weight: 400;
    }

    .copyright a {
      display: none;
    }

    @media (max-width: 960px) {
      .footer {
        gap: 40px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        padding: 20px 8vw;
      }

      .brand {
        max-width: 300px;
      }

      .menus {
        align-items: flex-start;
      }

      .menus-links {
        justify-content: flex-start;
      }

      .copyright {
        padding: 12px 5vw;
      }
    }

    @media (max-width: 360px) {
      .footer .h5 {
        font-size: 14px;
      }

      .menus a {
        font-size: 12px;
      }

      .menus-links {
        gap: 8px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <footer>
        <section className="footer">
          <div className="brand">
            <img src="/img/logo_white.png" alt="Logo MCM" />

            <div className="social">
              {/* Twitter
              <a
                href="https://twitter.com/seuPerfilNoTwitter"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="16"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    fill="#e2e0e5"
                    d="M6.038 16c7.246 0 11.208-6.155 11.208-11.492 0-.175-.003-.35-.011-.523A8.127 8.127 0 0 0 19.2 1.894a7.702 7.702 0 0 1-2.262.636A4.038 4.038 0 0 0 18.67.296c-.773.47-1.62.802-2.501.98A3.89 3.89 0 0 0 13.293 0c-2.175 0-3.94 1.809-3.94 4.039 0 .317.035.625.103.92C6.182 4.792 3.28 3.184 1.336.74a4.107 4.107 0 0 0-.533 2.03c0 1.402.695 2.639 1.753 3.363a3.837 3.837 0 0 1-1.784-.505v.051c0 1.956 1.357 3.59 3.16 3.96a3.853 3.853 0 0 1-1.78.069c.502 1.605 1.956 2.773 3.68 2.805A7.78 7.78 0 0 1 0 14.185 10.951 10.951 0 0 0 6.038 16"
                  />
                </svg>
              </a> */}

              {/* Facebook
              <a
                href="https://facebook.com/seuPerfilNoFacebook"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="20"
                  fill="none"
                  viewBox="0 0 11 20"
                >
                  <path
                    fill="#e2e0e5"
                    d="m10.009 11.249.555-3.618h-3.47V5.284c0-.99.484-1.955 2.04-1.955h1.577V.244S9.28 0 7.907 0c-2.858 0-4.73 1.733-4.73 4.871v2.76H0v3.618h3.178V20h3.91v-8.751h2.92Z"
                  />
                </svg>
              </a> */}

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@mcmmontagens"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="14"
                  fill="none"
                  viewBox="0 0 18 14"
                >
                  <path
                    fill="#e2e0e5"
                    d="m9.37 13.043-3.6-.066c-1.166-.023-2.334.023-3.477-.215C.554 12.407.43 10.666.303 9.205a24.955 24.955 0 0 1 .225-6.181c.19-1.143.934-1.825 2.086-1.899C6.5.855 10.413.888 14.29 1.013c.41.012.822.075 1.226.147 1.994.349 2.042 2.322 2.172 3.984a22.587 22.587 0 0 1-.172 5.032c-.198 1.38-.576 2.538-2.172 2.65-2 .146-3.953.263-5.957.226 0-.009-.012-.009-.018-.009ZM7.254 9.55c1.506-.865 2.984-1.716 4.482-2.575-1.51-.865-2.984-1.716-4.482-2.575v5.15Z"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mcmmontagens/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#e2e0e5"
                    d="M10 2.163c2.655 0 2.966.01 4.013.058 1.048.048 1.666.218 2.058.362a4.162 4.162 0 0 1 1.516.993 4.162 4.162 0 0 1 .993 1.516c.144.392.314 1.01.362 2.058.048 1.047.058 1.358.058 4.013s-.01 2.966-.058 4.013c-.048 1.048-.218 1.666-.362 2.058a4.162 4.162 0 0 1-.993 1.516 4.162 4.162 0 0 1-1.516.993c-.392.144-1.01.314-2.058.362-1.047.048-1.358.058-4.013.058s-2.966-.01-4.013-.058c-1.048-.048-1.666-.218-2.058-.362a4.162 4.162 0 0 1-1.516-.993 4.162 4.162 0 0 1-.993-1.516c-.144-.392-.314-1.01-.362-2.058C2.173 12.966 2.163 12.655 2.163 10s.01-2.966.058-4.013c.048-1.048.218-1.666.362-2.058a4.162 4.162 0 0 1 .993-1.516 4.162 4.162 0 0 1 1.516-.993c.392-.144 1.01-.314 2.058-.362C7.034 2.173 7.345 2.163 10 2.163zm0-2.163C7.327 0 7.006.01 5.947.058 4.885.107 4.026.314 3.264.632a6.259 6.259 0 0 0-2.262 1.48A6.259 6.259 0 0 0-.63 4.239C-.948 5.001-1.155 5.86-1.204 6.922-.251 7.003 0 7.327 0 10c0 2.673-.007 2.997-.058 4.056-.049 1.062-.256 1.921-.574 2.683a6.259 6.259 0 0 0 1.48 2.262 6.259 6.259 0 0 0 2.262 1.48c.762.318 1.621.525 2.683.574 1.059.05 1.383.058 4.056.058s2.997-.007 4.056-.058c1.062-.049 1.921-.256 2.683-.574a6.259 6.259 0 0 0 2.262-1.48 6.259 6.259 0 0 0 1.48-2.262c.318-.762.525-1.621.574-2.683.05-1.059.058-1.383.058-4.056s-.007-2.997-.058-4.056c-.049-1.062-.256-1.921-.574-2.683a6.259 6.259 0 0 0-1.48-2.262 6.259 6.259 0 0 0-2.262-1.48c-.762-.318-1.621-.525-2.683-.574C12.997.007 12.673 0 10 0zM10 4.838a5.162 5.162 0 1 0 0 10.324A5.162 5.162 0 0 0 10 4.838zm0 8.5a3.338 3.338 0 1 1 0-6.676 3.338 3.338 0 0 1 0 6.676zm6.406-9.644a1.2 1.2 0 1 0 0 2.399 1.2 1.2 0 0 0 0-2.399z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/mcm-montagens-industriais/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#e2e0e5"
                    d="M4.5 20H0V6h4.5v14zM2.25 4.5a2.25 2.25 0 1 1 .002-4.5A2.25 2.25 0 0 1 2.25 4.5zM20 20h-4.5v-7c0-1.77-.03-4.05-2.468-4.05-2.468 0-2.844 1.924-2.844 3.914V20h-4.5V6h4.313v1.928h.063c.602-1.14 2.075-2.342 4.27-2.342C19.405 5.586 20 8.2 20 11.762V20z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="menus">
            <div className="h5">Menus</div>
            <div className="menus-links">
              <a href="#top">Home</a>
              <a href="#fardamentos">Fardamentos</a>
              <a href="#acessorios">Acessórios</a>
              <a href="#carrinho">Carrinho</a>
            </div>
          </div>
        </section>

        <section className="copyright">
          <p>
            <span>©</span> {year} Rights Reserved, MCM
          </p>
        </section>
      </footer>
    </>
  );
}
