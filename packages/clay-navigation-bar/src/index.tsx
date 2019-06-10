/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import React, {useRef, useState} from 'react';
import warning from 'warning';
import {useTransitionHeight} from '@clayui/shared';

interface IItemProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Determines the active state of an dropdown list item.
	 */
	active?: boolean;

	/**
	 * Children elements received from ClayNavigationBar.Item component.
	 */
	children: React.ReactElement;
}

type ItemType = React.FunctionComponent<IItemProps>;

const Item: ItemType = ({active, children, className, ...otherProps}) => {
	return (
		<li {...otherProps} className={classNames('nav-item', className)}>
			{React.Children.map(
				children,
				(child: React.ReactElement<IItemProps>, index) =>
					React.cloneElement(child, {
						...child.props,
						className: classNames(child.props.className, {
							active,
						}),
						key: index,
					})
			)}
		</li>
	);
};

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Children elements received from ClayNavigationBar component.
	 */
	children: React.ReactElement<IItemProps>[];

	/**
	 * Determines the style of the Navigation Bar
	 */
	inverted?: boolean;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap: string;

	/**
	 * Set up dropdown's trigger label.
	 */
	triggerLabel: string;
}

const ClayNavigationBar: React.FunctionComponent<IProps> & {
	Item: ItemType;
} = ({
	children,
	className,
	inverted = false,
	spritemap,
	triggerLabel,
	...otherProps
}) => {
	const [visible, setVisible] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [
		transitioning,
		handleTransitionEnd,
		handleClickToggler,
	] = useTransitionHeight(visible, setVisible, contentRef);

	const activeElementsCount = children.filter(child => child.props.active)
		.length;

	warning(
		activeElementsCount <= 1,
		`ClayNavigationBar expects 0 or 1 active children, but received ${activeElementsCount}`
	);

	return (
		<nav
			{...otherProps}
			className={classNames(
				className,
				'navbar',
				'navbar-collapse-absolute',
				'navbar-expand-md',
				'navbar-underline',
				'navigation-bar',
				{
					'navigation-bar-light': !inverted,
					'navigation-bar-secondary': inverted,
				}
			)}
		>
			<div className="container-fluid container-fluid-max-xl">
				<ClayLink
					aria-expanded={visible}
					className={classNames(
						'navbar-toggler',
						'navbar-toggler-link',
						{
							collapsed: !visible,
						}
					)}
					displayType="secondary"
					onClick={handleClickToggler}
				>
					{triggerLabel}

					<ClayIcon spritemap={spritemap} symbol="caret-bottom" />
				</ClayLink>

				<div
					className={classNames('navbar-collapse', {
						collapse: !transitioning,
						collapsing: transitioning,
						show: visible,
					})}
					data-testid="NavigationBarDropdown"
					onTransitionEnd={handleTransitionEnd}
					ref={contentRef}
				>
					<div className="container-fluid container-fluid-max-xl">
						<ul className="navbar-nav">{children}</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

ClayNavigationBar.Item = Item;

export default ClayNavigationBar;
