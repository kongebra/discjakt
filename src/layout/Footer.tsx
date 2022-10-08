const Footer = () => {
  return (
    <footer className="bg-teal-500 text-white py-4">
      <div className="max-w-7xl mx-auto text-center">
        <p>
          Copyright &copy; {new Date().getFullYear()} -{" "}
          <a
            href="https://kongebra.net"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            kongebra.net
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
