rjSearchScreening
=========

AngularJs module to Search.

Originally used to search a medical screening API and return the results.


##Usage

Essentially comes down to adding an attribute `rj-search="ENTERURLFORQUERYHERE"` (replace with url) to wrap everything.

And an attribute `rj-search-input` on the search input.

After that you need to still add a template for the results. See Below.


	<form method="post" role="form" name="ConditionSearch" rj-search="ENTERURLFORQUERYHERE" class="form-horizontal">
        <div id="power_search" ng-cloak>

            <div class="form-group iSearchString" >
	            <label class="col-xs-12 col-md-4 control-label" for="SearchString">Search for Condition</label>
				<div class="col-xs-12 col-md-4">
					<input class="form-control" id="SearchString" name="SearchString" ng-model="SearchString" placeholder="Search for Condition" type="text" value=""  required="required" pattern=".{3,}" rj-search-input=""/>
				</div>
            </div>
            
            <div class="alert alert-danger" ng-show="!!err" ng-bind="err.statusText"></div>
            <div class="col-md-8 col-md-offset-4">
                <ol ng-show="showSearch" class="list-unstyled">
                    <li ng-repeat="res in searchRes track by $index" ng-class="{selected: selected == $index}">
                        <button name="AddConditionId" class="btn btn-default btn-block " ng-class="{'btn-primary btn-lg': selected == $index}" type="submit" value="{{res.Key}}"><span class="glyphicon glyphicon-plus-sign"></span> {{res.Value}}</button>
                    </li>
                </ol>
            </div>
        </div>
    </form>

