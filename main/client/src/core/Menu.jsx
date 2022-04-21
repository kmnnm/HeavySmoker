import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from '../auth';
import './menu.css';

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { borderBottom: '4px solid #ff9900', color: 'white' };
  } else {
    return { color: '#ffffff' };
  }
};

const Menu = (props) => (
  <nav
    className="navbar navbar-expand-lg navbar-dark p-0 m-0 pr-2"
    style={{
      // background: '#646464',
      background: 'black',
      paddingTop: '15px',
      paddingBottom: '0',
      marginBottom: '50px',
    }}
  >
    <a
      className="navbar-brand"
      style={{
        color: 'white',
        fontFamily: 'Courgette, cursive',
      }}
      href="/main"
    >
      <img
        src="https://i.esdrop.com/d/cl3pewp2aooj/IhK3lMNIhJ.png"
        style={{ width: '150px' }}
      />
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item ">
          <Link
            className="nav-link"
            style={isActive(props.history, '/main')}
            to="/main"
          >
            <i className="fas fa-home mr-1"></i>메뉴
          </Link>
        </li>
        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(props.history, '/news')}
                to="/news"
              >
                <i class="fas fa-newspaper"></i>뉴스
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(props.history, '/')}
                to="/"
              >
                <i className="fas fa-sign-in-alt mr-1"></i>로그인
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(props.history, '/signup')}
                to="/signup"
              >
                <i className="fas fa-user-plus mr-1"></i>회원가입
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(props.history, '/news')}
                to="/news"
              >
                <i class="fas fa-newspaper"></i>뉴스
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={'/findpeople'}
                style={isActive(props.history, '/findpeople')}
              >
                <i className="fas fa-users mr-1"></i>전체 유저
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={'/post/create'}
                style={isActive(props.history, '/post/create')}
              >
                <i className="fas fa-plus mr-1"></i>글쓰기
              </Link>
            </li>
            <div className="dropdown">
              <button
                style={{ color: '#fff' }}
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-user-cog mr-1"></i>
                {`${isAuthenticated().user.name}'s profile`}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link
                  className="dropdown-item"
                  to={`/user/${isAuthenticated().user._id}`}
                >
                  <i className="fas fa-user mr-1"></i>내프로필
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/chats/${isAuthenticated().user._id}`}
                >
                  <i className="fas fa-comment-alt mr-1"></i>진실의방
                </Link>
                <span
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => signout(() => props.history.push('/'))}
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>로그아웃
                </span>
              </div>
            </div>
            {/* <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(props.history, `/user/${isAuthenticated().user._id}`)}
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={
                                (isActive(props.history, "/signup"),
                                { cursor: "pointer",color: "#fff" })
                            }
                            onClick={() => signout(() => props.history.push('/'))}
                        >
                            Sign Out
                        </span>
                    </li> */}
          </>
        )}
      </ul>
    </div>
  </nav>
);

export default withRouter(Menu);
