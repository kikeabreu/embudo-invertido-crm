/* Top Seller — thin geometric line icons, matching the line-art fox mark.
   Stroke 1.75, round caps. Registered on window for the UI kit screens. */
(function () {
  const S = ({ children, size = 18, style }) =>
    React.createElement(
      "svg",
      { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round",
        strokeLinejoin: "round", style },
      children
    );
  const P = (d) => React.createElement("path", { d });
  const make = (...parts) => (props) =>
    React.createElement(S, props, parts.map((p, i) => React.cloneElement(p, { key: i })));

  const Icons = {
    Dashboard: make(P("M3 3h7v7H3z"), P("M14 3h7v4h-7z"), P("M14 11h7v10h-7z"), P("M3 14h7v7H3z")),
    Pipeline: make(P("M3 6h18"), P("M6 12h12"), P("M9 18h6")),
    Leads: make(React.createElement("circle",{cx:9,cy:8,r:3.2}), P("M3.5 19a5.5 5.5 0 0 1 11 0"), P("M17 8h4"), P("M17 12h4")),
    Reports: make(P("M4 20V10"), P("M10 20V4"), P("M16 20v-7"), P("M22 20H2")),
    Inbox: make(P("M3 13l3-8h12l3 8"), P("M3 13v6h18v-6"), P("M3 13h5l1.5 2.5h5L21 13")),
    Settings: make(React.createElement("circle",{cx:12,cy:12,r:3}), P("M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1")),
    Search: make(React.createElement("circle",{cx:11,cy:11,r:7}), P("M21 21l-4-4")),
    Plus: make(P("M12 5v14M5 12h14")),
    Bell: make(P("M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"), P("M13.7 21a2 2 0 0 1-3.4 0")),
    Bolt: make(P("M13 2L4 14h7l-1 8 9-12h-7l1-8z")),
    Trophy: make(P("M7 4h10v5a5 5 0 0 1-10 0z"), P("M7 6H4v1a3 3 0 0 0 3 3"), P("M17 6h3v1a3 3 0 0 1-3 3"), P("M10 14h4M9 20h6M12 17v3")),
    Phone: make(P("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z")),
    Mail: make(P("M3 6h18v12H3z"), P("M3 7l9 6 9-6")),
    Arrow: make(P("M5 12h14M13 6l6 6-6 6")),
    Check: make(P("M4 12l5 5L20 6")),
    Filter: make(P("M3 5h18l-7 8v5l-4 2v-7z")),
    Dots: make(React.createElement("circle",{cx:5,cy:12,r:1.4}), React.createElement("circle",{cx:12,cy:12,r:1.4}), React.createElement("circle",{cx:19,cy:12,r:1.4})),
    Calendar: make(P("M4 6h16v15H4z"), P("M4 10h16M8 3v4M16 3v4")),
    Target: make(React.createElement("circle",{cx:12,cy:12,r:8}), React.createElement("circle",{cx:12,cy:12,r:4}), React.createElement("circle",{cx:12,cy:12,r:1})),
    TrendUp: make(P("M3 17l6-6 4 4 8-8"), P("M15 7h6v6")),
  };
  window.TSIcons = Icons;
})();
