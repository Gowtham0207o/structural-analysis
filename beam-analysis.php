
<?php 
include 'libs/load.php';
$result=true;
if(logincheck::loggedin()){
  $result=false;
}
if(!$result){
?>

<!DOCTYPE html>
<html lang="en">

<?php load_template("head");?>

<body>
    <?php load_template("header");?>

    <div class="container-fluid">
        <div class="row">
            <?php load_template("navbar");?>
            <main class="col-md-9 ms-sm-auto col-lg-10 pb-5 px-md-4">
                <div class="jumbotron pt-3" id="beam">
                    <h1 class="display-4">Beam analysis</h1>
                    <p class="lead">
                        Welcome to the one stop tool for quick and efficient structural
                        calculations.
                    </p>
                    <hr class="my-4" />
                    <p class="pt-4 pb-4 mb-3">
                        The Beam Analysis Dashboard is your comprehensive tool for guaranteeing the safety and stability
                        of your beams. With access to live data and expert insights, we
                        enable you to make well-informed choices and preemptively tackle any beam-related concerns.
                        Whether you're overseeing a construction endeavor, or exploring
                        the intricacies of beam analysis, this dashboard stands as your essential reference
                    </p>
                </div>
                <h1 class="display-4 pt-4 mt-4">Define Your Beam:</h1>
                <section id="main-interface" class="container model-initial">
                    <div class="row">
                    <div class="col-md-8">
                            <div class="row beam-design">
                                <canvas id="c"></canvas>
                                <script>
                                var c = document.querySelector("#c");
                                var ctx = c.getContext("2d");
                                c.style.width = '100%';
                                c.style.height = '100%';
                                c.width = c.offsetWidth - 30;
                                c.height = 250;
                                var design_width = parseFloat(c.width) - 150;
                                ctx.strokeRect(75, 115, design_width, 20);
                                </script>
                            </div>
                        
                            <!--<input type="file" id="theFile" style="display:none" accept=".obm" onchange="example()"/>-->
                            <div class="row">
                               
                                <div class="col-md-4" id="spinnerContainer" class="spinner" class="col-md-4"></div>
                                <div class="col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-4 col-xs-offset-4">
                                    <button type="button" id="run-model" class="btn btn-success">Analyse</button>
                                    <button type="button" class="btn btn-primary pull-right"
                                        onclick="open_pdf_modal();">Export</button>
                                </div>
                            </div>
                            <div class="row">
                                <h5 id="o-beam-updates" class="text-center"></h5>
                            </div>
                        
                        </div>
                        <div class="col-md-4">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card card-default">
                                        <div class="card-heading text-center"><strong>Model Setup</strong></div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <input type="btn" name="onoffswitch"
                                                        class="onoffswitch-checkbox onoffswitch" id="myonoffswitch"
                                                        onchange="#" checked>
                                                    <label class="onoffswitch-label" for="myonoffswitch">
                                                        <span class="onoffswitch-inner"></span>

                                                    </label>
                                                </div>
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <select id="select-length" class="form-control"
                                                        onchange="convert_unit_system()">
                                                        <option value="m">m</option>
                                                        <option value="cm">cm</option>
                                                        <option value="mm">mm</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <select id="select-force" class="form-control"
                                                        onchange="convert_unit_system()">
                                                        <option value="kN">kN</option>
                                                        <option value="N">N</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <label class="control-label">Length:</label>
                                                </div>
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <input type="text" class="form-control" name="beam-length"
                                                        id="beam-length" autocomplete="off" onblur="add_beam_length()">
                                                </div>
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <p>(<span class="length-unit">m</span>)</p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <label class="control-label">Section:</label>
                                                </div>
                                                <!--<div class="col-md-4 col-sm-3 col-xs-4">
                                        <input type="text" class="form-control" name="section-name-modal" id="section-name" disabled>
                                    </div>!-->
                                                <div class="col-md-4 col-sm-3 col-xs-4">
                                                    <button type="button" class="btn btn-primary"
                                                        onclick="new_section_modal()">Select</button>
                                                    <!--data-toggle="modal" data-target="#section-modal"!-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-6 col-xs-6 pt-2 pb-2">
                                    <div class="card card-default">
                                        <div class="card-heading text-center"><strong>Support Types</strong></div>
                                        <div class="card-body">
                                            <div class="row text-center">
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_support_modal('add-pinned-modal')">Pinned<img
                                                            src="image/hinged.png"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_support_modal('add-roller-modal')">Roller<img
                                                            src="image/roller.png"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_support_modal('add-fixed-modal')">Fixed<img
                                                            src="image/fixed.png"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-12 col-sm-6 col-xs-6 pb-2">
                                    <div class="card card-default">
                                        <div class="card-heading text-center"><strong>Applied Loads</strong></div>
                                        <div class="card-body">
                                            <div class="row text-center">
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_load_modal('add-point-modal')">Point<img
                                                            src="image/poin.png"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_load_modal('add-distributed-modal')">Distributed<img
                                                            src="https://optimalbeam.com/images/distributed.PNG"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a href="javascript:;"
                                                        onclick="open_load_modal('add-moment-modal')">Moment<img
                                                            src="https://optimalbeam.com/images/moment.PNG"
                                                            class="beam-input-image img-responsive center-block"></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </section>

                <section id="analysis-results">
                    
                    <div class="container">
                    <div class="row">
                                <table class="table table-bordered table-hover" id="table-variables">
                                    <thead>
                                        <tr>
                                            <th class="text-center col-xs-4">
                                                Type
                                            </th>
                                            <th class="text-center col-xs-3">
                                                Location (<span class="length-unit">m</span>)
                                            </th>
                                            <th class="text-center col-xs-3">
                                                Load (<span class="force-unit">kN</span>)|(<span
                                                    class="force-unit">kN</span>-<span class="length-unit">m</span>)
                                            </th>
                                            <th class="text-center col-xs-2">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="row">
                                <table class="table table-bordered table-hover" id="table-section-properties">
                                    <thead>
                                        <tr>
                                            <th class="text-center col-xs-2">
                                                Beam Section
                                            </th>
                                            <th class="text-center col-xs-2">
                                                Location (<span class="length-unit">m</span>)
                                            </th>
                                            <th class="text-center col-xs-6">
                                                Properties
                                            </th>
                                            <th class="text-center col-xs-2">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        <div>
                            <h2>Reactions</h2>
                            <p id="reaction-results"></p>
                            <hr>
                        </div>
                        <div>
                            <h2>Shear Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="shear-limits"></div>
                                    <div id="shear-specific-point"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="shear-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div>
                            <h2>Fixed End moments</h2>
                            <p id="moment-results"></p>
                            <hr>
                        </div>
                        <div>
                            <h2>Moment Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="moment-limits"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="moment-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div>
                            <h2>Slope Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="slope-limits"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="slope-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div>
                            <h2>Deflection Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="deflection-limits"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="deflection-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div>
                            <h2>Average Shear Stress Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="shear-stress-limits"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="shear-stress-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div>
                            <h2>Bending Stress Diagram</h2>
                            <div class="row">
                                <div class="col-md-4">
                                    <div id="bending-stress-limits"></div>
                                </div>
                                <div class="col-md-8">
                                    <div id="bending-stress-chart"></div>
                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                </section>
                   <!-- Modal -->
    <div class="modal fade" id="section-modal" tabindex="-1" role="dialog" aria-labelledby="section_modal_label"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h2 class="modal-title" id="section-modal-label">Section Properties</h2>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" action="#" method="post">
                    
                        <div class="form-group">
                            <label class="control-label col-sm-3">Section Name:</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" name="section-name-modal"
                                    id="section-name-modal" value="" autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-3">Location:</label>
                            <div class="row">
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="section-start-location"
                                    id="section-start-location" value="" autocomplete="off">
                            </div>
                            <div class="col-sm-1 text-center">
                                <label class="control-label">-</label>
                            </div>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="section-end-location"
                                    id="section-end-location" value="" autocomplete="off">
                            </div>
</div>
                        </div>
                        <div class="custom">
                            <div class="col-sm-12">
                                
                                <div class="form-group">
                                <div class="row">
                                    <label class="control-label col-sm-4">Modulus of Elasticity (<span
                                            class="section-stress-unit">MPa</span>):</label>
                                    <div class="col-sm-3">
                                        <input type="text" class="form-control" name="modulus-of-elasticity"
                                            id="modulus-of-elasticity" value="200000" disabled autocomplete="off">
                                    </div>
                                    <div class="col-sm-3">
                                        <select class="selectpicker input-sm" id="select-material"
                                            onchange="change_elasticity()">
                                            <option value="Steel">Steel</option>
                                            <option value="Aluminium">Aluminium</option>
                                            <option value="Wood">Oak Wood</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="control-label col-sm-6">Area (<span
                                            class="section-length-unit">mm</span><sup>2</sup>):</label>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" name="area" id="area" value=""
                                            autocomplete="off">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-sm-6">Moment of Inertia (<span
                                            class="section-length-unit">mm</span><sup>4</sup>):</label>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" name="moment-of-inertia"
                                            id="moment-of-inertia" value="" autocomplete="off">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-sm-6">y-top (<span
                                            class="section-length-unit">mm</span>):</label>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" name="y-top" id="y-top" value=""
                                            autocomplete="off">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-sm-6">y-bottom (<span
                                            class="section-length-unit">mm</span>):</label>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" name="y-bottom" id="y-bottom" value=""
                                            autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <img src="image/section.png" class="img-custom">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5">
                                <button type="button" class="btn btn-primary" onclick="add_section_to_database()">Add to
                                    Database</button>
                            </div>
                            <div class="col-sm-5">
                                <button type="button" class="btn btn-primary"
                                    onclick="remove_section_from_database()">select from database</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="add-section" class="btn btn-primary" onclick="add_beam_section()">Add
                        Section</button>
                    <!--<button type="button" id="add-section" class="btn btn-primary" onclick="update_beam_properties()">Save changes</button>-->
                </div>
                <p class="text-center" id="section-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal
    <div id="save-modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Save Model</h4>
                </div>
                <div class="modal-body">
                    <label class="control-label">Model Name:</label>
                    <input type="text" class="form-control" name="area" id="model-name-save" value ="" data-modalfocus>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="save-model" class="btn btn-primary" onclick="save_model('model-name-save')" data-bs-dismiss="modal">Save Model</button>
                </div>
            </div>
        </div>
    </div>

    <div id="saveas-modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Save As Model</h4>
                </div>
                <div class="modal-body">
                    <label class="control-label">Model Name:</label>
                    <input type="text" class="form-control" name="area" id="model-name-save" value ="" data-modalfocus>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="saveas-model" class="btn btn-primary" onclick="save_model('model-name-saveas')" data-bs-dismiss="modal">Save Model</button>
                </div>
            </div>
        </div>
    </div> -->

    <!-- Modal -->
    <div id="add-pinned-modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Pinned Support</h4>
                </div>
                <div class="modal-body text-center">
                    <label class="control-label">Location (<span class="length-unit">m</span>):</label>
                    <div>
                        <select class="selectpicker input-sm" id="pinned-location-select"
                            onchange="location_select('pinned')">
                            <option value="Other">Support Location</option>
                            <option value="Left">Left Side</option>
                            <option value="Right">Right Side</option>
                        </select>
                        <input type="text" value="" name="pinned-location" id="pinned-location" data-modalfocus
                            autocomplete="off">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-pinned-support" type="button" class="btn btn-primary"
                        onclick="add_support('pinned')">Add Another</button>
                    <button id="add-pinned-support" type="button" class="btn btn-primary"
                        onclick="add_support('pinned')" data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center support-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="add-roller-modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Roller Support</h4>
                </div>
                <div class="modal-body text-center">
                    <label class="control-label">Location (<span class="length-unit">m</span>):</label>
                    <div>
                        <select class="selectpicker input-sm" id="roller-location-select"
                            onchange="location_select('roller')">
                            <option value="Other">Support Location</option>
                            <option value="Left">Left Side</option>
                            <option value="Right">Right Side</option>
                        </select>
                        <input type="text" value="" name="support-location" id="roller-location" data-modalfocus
                            autocomplete="off">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-roller-support" type="button" class="btn btn-primary"
                        onclick="add_support('roller')">Add Another</button>
                    <button id="add-roller-support" type="button" class="btn btn-primary"
                        onclick="add_support('roller')" data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center support-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="add-fixed-modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Fixed Support</h4>
                </div>
                <div class="modal-body text-center">
                    <label class="control-label">Location (<span class="length-unit">m</span>):</label>
                    <div>
                        <select class="selectpicker input-sm" id="fixed-location-select"
                            onchange="location_select('fixed')" data-modalfocus>
                            <option value="Left">Left Side</option>
                            <option value="Right">Right Side</option>
                        </select>
                        <input type="text" value="0" name="support-location" id="fixed-location" disabled>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-fixed-support" type="button" class="btn btn-primary"
                        onclick="add_support('fixed')">Add Another</button>
                    <button id="add-fixed-support" type="button" class="btn btn-primary" onclick="add_support('fixed')"
                        data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center support-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="add-point-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Point Load</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" action="#" method="post">
                        <div class="form-group">
                            <label class="control-label col-sm-3 col-sm-offset-3">Location (<span
                                    class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="point-location" id="point-location"
                                    value="" data-modalfocus autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-3 col-sm-offset-3">Load (<span
                                    class="force-unit">kN</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="point-load" id="point-load" value=""
                                    autocomplete="off">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-point-load" type="button" class="btn btn-primary"
                        onclick="add_point_load()">Add Another</button>
                    <button id="add-point-load" type="button" class="btn btn-primary" onclick="add_point_load()"
                        data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center load-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="add-distributed-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Distributed Load</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" action="#" method="post">
                        <div class="form-group">
                            <label class="control-label col-sm-4 col-sm-offset-2">Start Location (<span
                                    class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="start-dlocation" id="start-dlocation"
                                    value="" data-modalfocus autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-4 col-sm-offset-2">End Location (<span
                                    class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="end-dlocation" id="end-dlocation" value=""
                                    autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-4 col-sm-offset-2">Start Load (<span
                                    class="force-unit">kN</span>/<span class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="start-dload" id="start-dload" value=""
                                    autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-4 col-sm-offset-2">End Load (<span
                                    class="force-unit">kN</span>/<span class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="end-dload" id="end-dload" value=""
                                    autocomplete="off">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-distributed-load" type="button" class="btn btn-primary"
                        onclick="add_distributed_load()">Add Another</button>
                    <button id="add-distributed-load" type="button" class="btn btn-primary"
                        onclick="add_distributed_load()" data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center load-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="add-moment-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Moment Load</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" action="#" method="post">
                        <div class="form-group">
                            <label class="control-label col-sm-3 col-sm-offset-3">Location (<span
                                    class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="moment-location" id="moment-location"
                                    value="" data-modalfocus autocomplete="off">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-3 col-sm-offset-3">Load (<span
                                    class="force-unit">kN</span>-<span class="length-unit">m</span>):</label>
                            <div class="col-sm-3">
                                <input type="text" class="form-control" name="moment-load" id="moment-load" value=""
                                    autocomplete="off">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-another-moment-load" type="button" class="btn btn-primary"
                        onclick="add_moment_load()">Add Another</button>
                    <button id="add-moment-load" type="button" class="btn btn-primary" onclick="add_moment_load()"
                        data-bs-dismiss="modal">Add</button>
                </div>
                <p class="text-center load-modal-error"></p>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="manager-model-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 id="manager-model-title" class="modal-title">Open Model</h4>
                </div>
                <div class="modal-body">
                    <div id="model-input-save">
                    </div>
                    <ul id="folder-list">
                    </ul>
                    <ul id="file-list">
                        <li class='list-group-item'>You do not have any saved models</li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <p id="file-manager-updates" class="text-center"></p>
                    <button type="button" id="folder-button" class="btn btn-default pull-left"
                        onclick="create_folder()"><span class="glyphicon glyphicon-plus-sign"></span> Folder</button>
                    <!--<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
                    <!--<button type="button" class="btn btn-danger" onclick="remove_model_from_database()">Delete</button>-->
                    <button id="manager-action" type="button" class="btn btn-primary" data-bs-dismiss="modal"
                        onclick="open_saved_model()">Open</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="upgrade-account-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Upgrade Account</h4>
                </div>
                <div class="modal-body">
                    <p>You need to log-in or upgrade your account to access this feature</p>
                    <a type="button" class="btn btn-primary" href="log-inb840.html?location=beam-calculator.php"
                        target="_blank">log-in</a>
                    <a style="margin-left: 20px;" type="button" class="btn btn-primary" href="pricing.html">Upgrade</a>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="pdf-export-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                    <h4 class="modal-title">PDF Export</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" action="#" method="post">
                        <div class="form-group">
                            <label class="control-label col-sm-3">Designer Name:</label>
                            <div class="col-sm-4">
                                <input type="text" class="form-control" name="designer-name" id="designer-name" value=""
                                    data-modalfocus autocomplete="off">
                            </div>
                        </div>
                        <div id="logo-options" class="form-group">
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-3" style="padding-left: 15px">Graphs:</label>
                            <div id="chart-checkbox" class="col-sm-9">
                                <label class="checkbox-inline"><input type="checkbox" id="shear-checkbox"
                                        checked>Shear</label>
                                <label class="checkbox-inline"><input type="checkbox" id="moment-checkbox"
                                        checked>Moment</label>
                                <label class="checkbox-inline"><input type="checkbox" id="slope-checkbox"
                                        checked>Slope</label>
                                <label class="checkbox-inline"><input type="checkbox" id="deflection-checkbox"
                                        checked>Deflection</label>
                                <label class="checkbox-inline"><input type="checkbox" id="bending-stress-checkbox"
                                        checked>Bending Stress</label>
                                <label class="checkbox-inline"><input type="checkbox" id="shear-stress-checkbox"
                                        checked>Shear Stress</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="add-moment-load" type="button" class="btn btn-primary" onclick="createPdf()"
                        data-bs-dismiss="modal">Export</button>
                </div>
            </div>
        </div>
    </div>

            </main>

        </div>
    </div>


    <?php load_template("footer");?>

</body>

</html>
<?php
}
else{

  header('location:/login.php');
}
?>