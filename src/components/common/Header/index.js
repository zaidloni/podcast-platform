import { Link, useLocation } from "react-router-dom";
import "./styles.css";
const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="navbar">
      <div className="gradient"></div>

      <div className="links">
        <Link to="/" className={currentPath === "/" ? "active" : ""}>
          Sign Up
        </Link>
        <Link
          to="/podcasts"
          className={currentPath === "/podcasts" ? "active" : ""}
        >
          Podcast
        </Link>
        <Link
          to="/create-a-podcast"
          className={currentPath === "/create-a-podcast" ? "active" : ""}
        >
          Create A Podcast
        </Link>
        <Link
          to="/profile"
          className={currentPath === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Header;
