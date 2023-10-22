        <div class="jumbotron pt-3" id="truss">
          <h1 class="display-4">Truss Analysis Tool:</h1>
          <p class="lead">
            Welcome to the truss analysis tool for quick and efficient truss
            calculations.
          </p>
          <hr class="my-4" />
          <p>
            Optimize your truss structural analysis with our efficient and user-friendly tool.
          </p>
        </div>
        <div
          class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Dashboard</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
              <button type="button" class="btn btn-sm btn-outline-secondary">
                Share
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary">
                Export
              </button>
            </div>
            <div class="container mt-4">
              <div class="dropdown">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span data-feather="calendar"></span>
                  Add new
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item"data-bs-toggle="modal"
                    data-bs-target="#contactModal" href="#">Support</a></li>
                  <li><a class="dropdown-item"data-bs-toggle="modal"
                    data-bs-target="#contactModal" href="#">Point Load</a></li>
                  <li><a class="dropdown-item"data-bs-toggle="modal"
                    data-bs-target="#contactModal" href="#">Member</a></li>
                  <li><a class="dropdown-item"data-bs-toggle="modal"
                    data-bs-target="#contactModal" href="#">UDL</a></li>
                  <li><a class="dropdown-item"data-bs-toggle="modal"
                    data-bs-target="#contactModal" href="#">Moment</a></li>
                </ul>
              </div>
            </div>
            <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="contactModalLabel">Enter the details</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <div class="row">
                           
                              <div class="col-md-6">
                                  <!-- Contact Form -->
                                  <form action="#" method="POST" id="myForm">
                                      <input type="hidden" name="form_type" value="download">
                                      <div class="mb-3">
                                          <label for="name" class="form-label">X coordinate</label>
                                          <input type="text" name="name" class="form-control custom_form" id="name" required>
                                      </div>
                                      <div class="mb-3">
                                        <label for="name" class="form-label">Y coordinate</label>
                                        <input type="text" name="name" class="form-control custom_form" id="name" required>
                                    </div>
                                      <div class="mb-5">
                                          <label for="email" class="form-label">Type</label>
                                          <input type="email" name="email" class="form-control custom_form" placeholder="(eg.roller)" id="email" required>
                                      </div>
                                      <p id="downpara"></p>
                                      <button type="submit" class="btn btn-primary" id="downloadBtn">Apply</button>
                                  </form>
                                
                              </div>
                          </div>
                      </div>
  
                  </div>
              </div>
          </div>
          </div>
        </div>

        <canvas class="my-4 w-100" id="beamChart" width="900" height="380"></canvas>

        <h2>Select the Type of Truss</h2>

        <div class="container pt-4">
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <fieldset>
                  <label class="radio-label"><input type="radio" name="roofType" value="Pratt Roof" />
                    Pratt Roof</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Howe Roof" />
                    Howe Roof</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Fink Roof" />
                    Fink Roof</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Parallel Chord Roof" />
                    Parallel Chord Roof</label>
                </fieldset>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <fieldset>
                  <label class="radio-label"><input type="radio" name="roofType" value="Pratt Bridge" />
                    Pratt Bridge</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Howe Bridge" />
                    Howe Bridge</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Warren Bridge" />
                    Warren Bridge</label>
                  <label class="radio-label"><input type="radio" name="roofType" value="Scissor Truss" />
                    Scissor Truss</label>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
        <div class="row pb-4 pt-4">
          <div class="col">
            <input type="text" class="form-control" placeholder="Truss span (in m)" aria-label="Truss span" />
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="Truss height (in m)" aria-label="Truss height" />
          </div>
        </div>
        <div class="row g-3 pt-4 pb-4 align-items-center">
          <div class="col-auto">
            <label for="inputPassword6" class="col-form-label">Web Bays</label>
          </div>
          <div class="col-auto">
            <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" />
          </div>
          <div class="col-auto">
            <span id="passwordHelpInline" class="form-text">
              Number of Web Bays (per side)
            </span>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-lg">
          Calculate Forces
        </button>
      </main>