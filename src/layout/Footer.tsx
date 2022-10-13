const Footer = () => {
  return (
    <footer className="bg-white border-t py-4">
      <div className="max-w-7xl mx-auto text-center">
        <p>
          Copyright &copy; {new Date().getFullYear()} -{" "}
          <a
            href="https://kongebra.net"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline text-gray-500 hover:text-black"
          >
            kongebra.net
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
