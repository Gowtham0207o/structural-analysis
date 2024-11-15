<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          
          <ul class="nav flex-column">
          <li class="nav-item" >
              <a class="nav-link" aria-current="page" href="#">
                <span data-feather="home"></span>
                <h2>Hey
                <?php echo session::get('username');?>!👋
</h2>
              </a>
            </li>
            <li class="nav-item" >
              <a class="nav-link active" aria-current="page" href="index.php">
                <span data-feather="home"></span>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="beam-analysis.php">
                <span data-feather="file"></span>
                Beam analysis
              </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right"
                                                title="upcoming" class="red-tooltip">
              <a class="nav-link" href="#">
                <span data-feather="shopping-cart"></span>
                Truss analysis
              </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right"
                                                title="upcoming" class="red-tooltip">
              <a class="nav-link" href="#">
                <span data-feather="users"></span>
                Beam design
              </a>
            </li>

            <li class="nav-item" data-toggle="tooltip" data-placement="right"
                                                title="upcoming" class="red-tooltip">
              <a class="nav-link" href="#">
                <span data-feather="layers"></span>
                Reaction calculation
              </a>
            </li>
          </ul>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved designs (beta)</span>
            <a class="link-secondary" href="#" aria-label="Add a new report">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Current month
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Last quarter
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Year-end sale
              </a>
            </li>
          </ul>
          <div class="m-auto signout">
            <form method="POST" action="test_login.php">
          <button name="logout" class="btn btn-dark">Signout  <i class="fa-solid fa-right-from-bracket"></i></button>
</form>
          </div>

        </div>

      </nav>