<?php
/*
 * Copyright (c) 2015, Sgt. Kabukiman, https://github.com/sgt-kabukiman
 *
 * This file is released under the terms of the MIT license. You can find the
 * complete text in the attached LICENSE file or online at:
 *
 * http://www.opensource.org/licenses/mit-license.php
 */

namespace horaro\WebApp\Controller\Admin\Utils;

use horaro\WebApp\Controller\Admin\BaseController as RegularBaseController;

class BaseController extends RegularBaseController {
	public function indexAction() {
		return $this->redirect('/-/admin/utils/config');
	}
}
