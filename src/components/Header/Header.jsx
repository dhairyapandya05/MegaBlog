import React from "react";
import {Container, Logo, LogoutBtn} from "../index";
import {useNavigate, Link} from "react-router-dom";
import {useSelector} from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {name: "Home", slug: "/", active: true},
    {name: "Login", slug: "/login", active: !authStatus},
    {name: "SignUp", slug: "/signup", active: !authStatus},
    {name: "All Posts", slug: "/all-posts", active: !authStatus},
    {name: "Add Post", slug: "/add-post", active: !authStatus},
  ];
  return (
    <header className="py-3 shadow bg-gray-300">
      <Container>
        <nav className="flex">
          <div className="mr-4">
            <Link to="/">
              <Logo width="100px" />
            </Link>
          </div>
          <ul className="flex ml-auto">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.slug);
                    }}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {!!authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
