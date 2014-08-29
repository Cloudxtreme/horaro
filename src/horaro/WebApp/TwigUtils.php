<?php
/*
 * Copyright (c) 2014, Sgt. Kabukiman, https://bitbucket.org/sgt-kabukiman/
 *
 * This file is released under the terms of the MIT license. You can find the
 * complete text in the attached LICENSE file or online at:
 *
 * http://www.opensource.org/licenses/mit-license.php
 */

namespace horaro\WebApp;

class TwigUtils {
	public function scheduleColClass($idx) {
		$class = [];

		if ($idx >= 4) $class[] = 'hidden-lg';
		if ($idx >= 3) $class[] = 'hidden-md';
		if ($idx >= 2) $class[] = 'hidden-sm';
		if ($idx >= 2) $class[] = 'hidden-xs';

		return implode(' ', $class);
	}
	public function scheduleControlsClass($columns) {
		$class = [];

		if ($columns <= 2) $class[] = 'hidden-xs';
		if ($columns <= 2) $class[] = 'hidden-sm';
		if ($columns <= 3) $class[] = 'hidden-md';
		if ($columns <= 4) $class[] = 'hidden-lg';

		return implode(' ', $class);
	}
}