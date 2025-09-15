"use client";
import Script from "next/script";

export default function InstagramEmbed() {
  return (
    <section className="layout-block">
      <div
        className="embedsocial-hashtag"
        data-ref="440e06ac1e17e415988e9385dfdf3d6a9ff24382"
      >
        <a
          className="feed-powered-by-es feed-powered-by-es-slider-img es-widget-branding"
          href="https://embedsocial.com/social-media-aggregator/"
          target="_blank"
          title="Instagram widget"
        >
          <img
            src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp"
            alt="EmbedSocial"
          />
          <div className="es-widget-branding-text">Instagram widget</div>
        </a>
      </div>
      {/* Load EmbedSocial script for each page navigation */}
      <Script
        id={`embedsocial-hashtag-script-${Math.random()}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(d, s, id){
                var js; 
                js = d.createElement(s); 
                js.id = id; 
                js.src = "https://embedsocial.com/cdn/ht.js"; 
                d.getElementsByTagName("head")[0].appendChild(js);
              }(document, "script", "EmbedSocialHashtagScript"));
            `,
        }}
      />
    </section>
  );
}
