import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from './menu.model';
import { AppSessionService } from 'src/shared/session/app-session.service';
import UserFunction from 'src/shared/models/UserFunction';
declare function showItemLeftMenu(): any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {
    menu: any;

    menuItems = [];

    funcs: UserFunction[] | undefined;

    @ViewChild('sideMenu') sideMenu: ElementRef;

    constructor(
        private router: Router
        , private session: AppSessionService
        , private dataService: DataStateLeftMenuService
    ) {
        this.funcs = this.session.funcs;
    }

    async ngOnInit(): Promise<void> {
        this.initialize();
    }
    ngAfterViewInit() {
        showItemLeftMenu();
        //setactive khi thay đổi router
        this.loadActiveRouter(true);
        this.router.events.subscribe((val) => {
            this.loadActiveRouter();
        });
    }
    loadActiveRouter(reload: boolean = false) {
        let i = 0;
        let countActive = 0;
        this.menuItems.forEach(item => {
            let j = 0;
            //nếu là reload thì thêm ticket để check
            if (this.router.url.includes("?ticket=")) {
                if (this.router.url.includes(item.path + "?ticket=")) {
                    this.setActiveItem('ftms-active-', 1, i, 0);
                    countActive++;
                }
                if (item.items.length > 0) {
                    item.items.forEach(chil => {
                        if (this.router.url.includes(chil.path + "?ticket=")) {
                            this.setActiveItem('ftms-active-item-', 2, i, j, reload);
                            countActive++;
                        }
                        j++
                    })
                }
            } else {
                if (this.router.url == item.path) {
                    this.setActiveItem('ftms-active-', 1, i, 0);
                    countActive++;
                }
                if (item.items.length > 0) {
                    item.items.forEach(chil => {
                        if (this.router.url == chil.path) {
                            this.setActiveItem('ftms-active-item-', 2, i, j, reload);
                            countActive++;
                        }
                        j++
                    })
                }
            }
            i++;
        })
        //nếu không có item nào active thì tắt hết active
        if (countActive == 0) {
            let linkColor = document.querySelectorAll(".ftms-nav-link");
            let linkColorItem = document.querySelectorAll(".ftms-navbar-item");
            if (linkColor && linkColorItem) {
                linkColor.forEach(l => l.classList.remove("ftms-nav-menu-active"));
                linkColorItem.forEach((l) => l.classList.remove("ftms-nav-active"));
            }
        }
        // }
    }
    toggleSidebar() {
        let toggle = document.getElementById("ftms-footer-toggle"),
            nav = document.getElementById("ftms-nav-bar") as HTMLElement;
        let navName = document.querySelectorAll(".ftms-nav-name");
        let navLink = document.querySelectorAll(".ftms-nav-link");
        let navLinkGroup = document.querySelectorAll(".ftms-nav-link-group");
        let toggle1 = document.getElementById("ftms-footer-toggle1") as HTMLElement;
        let appName = document.getElementById("ftms-app-name-menu") as HTMLElement;
        let appNamehead = document.getElementById("ftms-app-name") as HTMLElement;
        let borderAppName = document.getElementById("ftms-boder-app-name") as HTMLElement;
        if (nav && toggle && toggle1) {
            if (window.innerWidth < 768) {
                return;
            }
            // show navbar
            nav.classList.toggle("show-leftMenu");
            // change icon
            toggle.classList.toggle("fa-angle-double-right");
            toggle.classList.toggle("fa-angle-double-left");
            toggle1.classList.toggle("fa-angle-double-right");
            toggle1.classList.toggle("fa-angle-double-left");
            toggle.classList.toggle("ftms-padding-icon-callap");
            // toggle.classList.toggle("ftms-padding-icon-callap");
            // ẩn hiện tên ưng dụng
            appNamehead.classList.toggle("ftms-hide-item");
            borderAppName.classList.toggle("ftms-hide-item");
            //ẩn tên menu
            appName.classList.toggle("ftms-margin-heade-nav");
            //ẩn hiện tên nav
            navName.forEach((l) => l.classList.toggle("ftms-hide-item"));
            //cho padding về 0 
            navLink.forEach((l) => l.classList.toggle("ftms-show-padding0"));
            //hover link tiem
            navLinkGroup.forEach((l) => l.classList.toggle("ftms-nav-link-item"));
            //body
            //tắt accondion menu
            let $el = document.querySelectorAll(".ftms-submenu");
            let $elLi = document.querySelectorAll(".ftms-nav-link-group");
            $el.forEach(e => {
                let ele = e as HTMLElement;
                ele.style.display = 'none';
            })
            $elLi.forEach((l) => l.classList.remove("ftms-open"));
            //chuyển trạng thái về flase;
            this.dataService.changeState(false);
            //kiểm tra xem menu cha có active không nếu đang active khi show ra thì show luôn menu
            if (nav.classList.contains("show-leftMenu")) {
                //nếu menu đang mở thì chuyển về true
                this.dataService.changeState(true);
                //kiểm tra menu xem cái nào đang active không
                let itemActiveMenu = document.querySelectorAll(".ftms-nav-menu-active")[0];
                if (itemActiveMenu) {
                    //kiểm tra xem menu có menu con không nếu có thì add class ftms-open
                    itemActiveMenu.parentNode.childNodes.forEach(el => {
                        let ele = el as HTMLElement;
                        if (ele.classList) {
                            if (ele.classList.contains("ftms-submenu")) {
                                let parent = ele.parentNode as HTMLElement;
                                parent.classList.add("ftms-open");
                                ele.style.display = 'block';
                            }
                        }
                    })
                }
            }
        }
    }
    setActiveItem(value: string, type: number, index: number, indexChild: number, isReload = false) {
        let linkColor = document.querySelectorAll(".ftms-nav-link");
        let linkColorItem = document.querySelectorAll(".ftms-navbar-item");
        if (type == 1) {
            value = value + index;
            if (linkColor) {
                let itemActive = document.getElementById(value);
                if (itemActive?.classList) {
                    if (itemActive.classList.contains("ftms-nav-cencal-active")) {
                        linkColor.forEach(l => l.classList.remove("ftms-nav-menu-active"));
                        itemActive.classList.add("ftms-nav-menu-active");
                        linkColorItem.forEach((l) => l.classList.remove("ftms-nav-active"));
                    }
                }
            }
        }
        if (type == 2) {
            if (linkColorItem) {
                value = value + index + '-' + indexChild;
                let itemActive = document.getElementById(value);
                linkColor.forEach(l => l.classList.remove("ftms-nav-menu-active"));
                itemActive?.parentNode?.parentNode?.parentNode?.childNodes?.forEach(el => {
                    let ele = el as HTMLElement;
                    if (ele.classList) {
                        if (ele.classList.contains("ftms-nav-link")) {
                            ele.classList.add("ftms-nav-menu-active");
                        }
                    }
                });
                linkColorItem.forEach((l) => l.classList.remove("ftms-nav-active"));
                itemActive?.classList.add("ftms-nav-active");
                if (isReload) {
                    let nav = document.getElementById("ftms-nav-bar");
                    //nếu đang toggle nav thì không mở
                    if (nav?.classList?.contains('show-leftMenu')) {
                        let parent = itemActive?.parentNode?.parentNode?.parentNode as HTMLElement;
                        if (!(parent.classList.contains("ftms-open"))) {
                            parent.classList.add("ftms-open");
                            parent.childNodes.forEach(e => {
                                let el = e as HTMLElement;
                                if (el.classList.contains("ftms-submenu")) {
                                    el.style.display = 'block';
                                }
                            })
                        }
                    }
                }
            }
        }
    }


    /**
     * Initialize
     */
    initialize(): void {
        // this.menuItems = MENU;
        this.menuItems = this.funcs;
    }

    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item: MenuItem) {
        return item.subItems !== undefined ? item.subItems.length > 0 : false;
    }
}
